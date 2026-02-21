package github

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"time"

	"github.com/ahmetburakdinc/codefossils/internal/models"
)

var searchQueries = []string{
	"abandoned project",
	"prototype NOT maintained",
	"experiment NOT fork",
	"proof of concept",
	"hackathon project",
	"side project",
	"weekend project",
	"toy project idea",
	"mvp startup",
	"concept app",
}

type Client struct {
	token      string
	httpClient *http.Client
}

func NewClient(token string) *Client {
	return &Client{
		token: token,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type searchResponse struct {
	Items []ghRepo `json:"items"`
}

type ghRepo struct {
	ID    int64 `json:"id"`
	Name  string `json:"name"`
	FullName string `json:"full_name"`
	Owner struct {
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	} `json:"owner"`
	HTMLURL     string   `json:"html_url"`
	Description *string  `json:"description"`
	Language    *string  `json:"language"`
	Topics      []string `json:"topics"`
	StarCount   int      `json:"stargazers_count"`
	ForksCount  int      `json:"forks_count"`
	PushedAt    string   `json:"pushed_at"`
	CreatedAt   string   `json:"created_at"`
}

func (c *Client) FetchStaleRepos() ([]models.Repo, error) {
	twoYearsAgo := time.Now().AddDate(-2, 0, 0).Format("2006-01-02")

	// Pick 3 random queries
	shuffled := make([]string, len(searchQueries))
	copy(shuffled, searchQueries)
	rand.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})
	queries := shuffled[:3]

	seen := make(map[int64]bool)
	var allRepos []models.Repo

	for _, q := range queries {
		searchQ := fmt.Sprintf("%s pushed:<%s stars:>5", q, twoYearsAgo)
		apiURL := fmt.Sprintf("https://api.github.com/search/repositories?q=%s&sort=stars&order=desc&per_page=30",
			url.QueryEscape(searchQ))

		req, err := http.NewRequest("GET", apiURL, nil)
		if err != nil {
			log.Printf("Error creating request for query %q: %v", q, err)
			continue
		}

		req.Header.Set("Accept", "application/vnd.github.mercy-preview+json")
		if c.token != "" {
			req.Header.Set("Authorization", "Bearer "+c.token)
		}

		resp, err := c.httpClient.Do(req)
		if err != nil {
			log.Printf("Error fetching query %q: %v", q, err)
			continue
		}

		if resp.StatusCode == 403 {
			resp.Body.Close()
			return allRepos, fmt.Errorf("GitHub API rate limit hit (403)")
		}

		if resp.StatusCode != 200 {
			resp.Body.Close()
			log.Printf("GitHub API returned %d for query %q", resp.StatusCode, q)
			continue
		}

		var result searchResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			resp.Body.Close()
			log.Printf("Error decoding response for query %q: %v", q, err)
			continue
		}
		resp.Body.Close()

		for _, item := range result.Items {
			if seen[item.ID] {
				continue
			}
			seen[item.ID] = true

			desc := ""
			if item.Description != nil {
				desc = *item.Description
			}
			lang := ""
			if item.Language != nil {
				lang = *item.Language
			}

			topics := item.Topics
			if topics == nil {
				topics = []string{}
			}

			pushedAt, _ := time.Parse(time.RFC3339, item.PushedAt)
			createdAt, _ := time.Parse(time.RFC3339, item.CreatedAt)

			repo := models.Repo{
				ID:          item.ID,
				Name:        item.Name,
				FullName:    item.FullName,
				OwnerLogin:  item.Owner.Login,
				OwnerAvatar: item.Owner.AvatarURL,
				HTMLURL:     item.HTMLURL,
				Description: desc,
				Language:    lang,
				Topics:      topics,
				Stargazers:  item.StarCount,
				Forks:       item.ForksCount,
				PushedAt:    pushedAt,
				CreatedAt:   createdAt,
				IdeaScore:   models.ComputeIdeaScore(item.StarCount, item.ForksCount, desc, topics),
				Category:    models.CategorizeRepo(item.Name, desc, topics, lang),
			}
			allRepos = append(allRepos, repo)
		}

		log.Printf("Fetched %d repos for query %q", len(result.Items), q)
	}

	log.Printf("Total unique repos fetched: %d", len(allRepos))
	return allRepos, nil
}
