package models

import (
	"math"
	"regexp"
	"strings"
	"time"
)

type Repo struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	FullName    string    `json:"full_name"`
	OwnerLogin  string    `json:"owner_login"`
	OwnerAvatar string    `json:"owner_avatar"`
	HTMLURL     string    `json:"html_url"`
	Description string    `json:"description"`
	Language    string    `json:"language"`
	Topics      []string  `json:"topics"`
	Stargazers  int       `json:"stargazers_count"`
	Forks       int       `json:"forks_count"`
	PushedAt    time.Time `json:"pushed_at"`
	CreatedAt   time.Time `json:"created_at"`
	IdeaScore   int       `json:"idea_score"`
	Category    string    `json:"category"`
	FetchedAt   time.Time `json:"fetched_at"`
}

type RepoListResponse struct {
	Repos   []Repo `json:"repos"`
	Total   int    `json:"total"`
	Page    int    `json:"page"`
	PerPage int    `json:"per_page"`
}

type StatsResponse struct {
	Categories map[string]int `json:"categories"`
	Total      int            `json:"total"`
}

func ComputeIdeaScore(stars, forks int, description string, topics []string) int {
	hasDesc := 0
	if description != "" {
		hasDesc = 1
	}
	descLen := len(description)
	if descLen > 120 {
		descLen = 120
	}
	hasTopics := 0
	if len(topics) > 0 {
		hasTopics = 1
	}

	score := math.Log2(float64(stars)+1)*8 +
		math.Log2(float64(forks)+1)*4 +
		float64(hasDesc)*10 +
		float64(descLen)/12.0 +
		float64(hasTopics)*5

	rounded := int(math.Round(score))
	if rounded > 100 {
		return 100
	}
	return rounded
}

var (
	webRe      = regexp.MustCompile(`\b(react|vue|angular|svelte|next|nuxt|web\s?app|frontend|dashboard|website|html|css|django|flask|rails|express)\b`)
	mobileRe   = regexp.MustCompile(`\b(ios|android|flutter|react.native|swift|kotlin|mobile)\b`)
	aiRe       = regexp.MustCompile(`\b(machine.learning|deep.learning|neural|nlp|gpt|llm|ai|ml|tensorflow|pytorch|model|transformer|diffusion)\b`)
	devToolsRe = regexp.MustCompile(`\b(cli|sdk|api|library|framework|plugin|extension|tool|linter|compiler|devtool|package)\b`)
	dataRe     = regexp.MustCompile(`\b(data|analytics|scraper|crawler|etl|pipeline|database|visualization|chart)\b`)
	gameRe     = regexp.MustCompile(`\b(game|unity|godot|phaser|rpg|puzzle|arcade|gameplay)\b`)
)

func CategorizeRepo(name, description string, topics []string, language string) string {
	text := strings.ToLower(name + " " + description + " " + strings.Join(topics, " ") + " " + language)

	if webRe.MatchString(text) {
		return "web"
	}
	if mobileRe.MatchString(text) {
		return "mobile"
	}
	if aiRe.MatchString(text) {
		return "ai"
	}
	if devToolsRe.MatchString(text) {
		return "dev-tools"
	}
	if dataRe.MatchString(text) {
		return "data"
	}
	if gameRe.MatchString(text) {
		return "game"
	}
	return "other"
}
