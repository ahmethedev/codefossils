package database

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/ahmetburakdinc/codefossils/internal/models"
	"github.com/lib/pq"
)

type RepoStore struct {
	db *sql.DB
}

func NewRepoStore(db *sql.DB) *RepoStore {
	return &RepoStore{db: db}
}

func (s *RepoStore) Upsert(repo models.Repo) error {
	query := `
	INSERT INTO repos (id, name, full_name, owner_login, owner_avatar, html_url,
		description, language, topics, stargazers, forks, pushed_at, created_at,
		idea_score, category, fetched_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	ON CONFLICT (id) DO UPDATE SET
		name = EXCLUDED.name,
		full_name = EXCLUDED.full_name,
		owner_login = EXCLUDED.owner_login,
		owner_avatar = EXCLUDED.owner_avatar,
		html_url = EXCLUDED.html_url,
		description = EXCLUDED.description,
		language = EXCLUDED.language,
		topics = EXCLUDED.topics,
		stargazers = EXCLUDED.stargazers,
		forks = EXCLUDED.forks,
		pushed_at = EXCLUDED.pushed_at,
		idea_score = EXCLUDED.idea_score,
		category = EXCLUDED.category,
		fetched_at = EXCLUDED.fetched_at`

	_, err := s.db.Exec(query,
		repo.ID, repo.Name, repo.FullName, repo.OwnerLogin, repo.OwnerAvatar,
		repo.HTMLURL, repo.Description, repo.Language, pq.Array(repo.Topics),
		repo.Stargazers, repo.Forks, repo.PushedAt, repo.CreatedAt,
		repo.IdeaScore, repo.Category, time.Now(),
	)
	return err
}

func (s *RepoStore) UpsertBatch(repos []models.Repo) (int, error) {
	count := 0
	for _, repo := range repos {
		if err := s.Upsert(repo); err != nil {
			return count, fmt.Errorf("upserting repo %d: %w", repo.ID, err)
		}
		count++
	}
	return count, nil
}

func (s *RepoStore) Query(category, sort, search string, page, perPage int) ([]models.Repo, int, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 30
	}

	var conditions []string
	var args []interface{}
	argIdx := 1

	if category != "" && category != "all" {
		conditions = append(conditions, fmt.Sprintf("category = $%d", argIdx))
		args = append(args, category)
		argIdx++
	}

	if search != "" {
		conditions = append(conditions, fmt.Sprintf(
			"(LOWER(name) LIKE $%d OR LOWER(COALESCE(description, '')) LIKE $%d OR array_to_string(topics, ' ') ILIKE $%d)",
			argIdx, argIdx, argIdx,
		))
		args = append(args, "%"+strings.ToLower(search)+"%")
		argIdx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	countQuery := "SELECT COUNT(*) FROM repos " + where
	var total int
	if err := s.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("counting repos: %w", err)
	}

	// Sort
	orderBy := "idea_score DESC"
	switch sort {
	case "latest":
		orderBy = "created_at DESC"
	case "stars":
		orderBy = "stargazers DESC"
	case "oldest":
		orderBy = "pushed_at ASC"
	}

	offset := (page - 1) * perPage
	selectQuery := fmt.Sprintf(`
		SELECT id, name, full_name, owner_login, COALESCE(owner_avatar, ''),
			html_url, COALESCE(description, ''), COALESCE(language, ''),
			topics, stargazers, forks, pushed_at, created_at,
			idea_score, category, fetched_at
		FROM repos %s
		ORDER BY %s
		LIMIT $%d OFFSET $%d`,
		where, orderBy, argIdx, argIdx+1,
	)
	args = append(args, perPage, offset)

	rows, err := s.db.Query(selectQuery, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("querying repos: %w", err)
	}
	defer rows.Close()

	var repos []models.Repo
	for rows.Next() {
		var r models.Repo
		if err := rows.Scan(
			&r.ID, &r.Name, &r.FullName, &r.OwnerLogin, &r.OwnerAvatar,
			&r.HTMLURL, &r.Description, &r.Language,
			pq.Array(&r.Topics), &r.Stargazers, &r.Forks,
			&r.PushedAt, &r.CreatedAt, &r.IdeaScore, &r.Category, &r.FetchedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("scanning repo: %w", err)
		}
		repos = append(repos, r)
	}

	if repos == nil {
		repos = []models.Repo{}
	}

	return repos, total, nil
}

func (s *RepoStore) Stats() (map[string]int, error) {
	rows, err := s.db.Query("SELECT category, COUNT(*) FROM repos GROUP BY category")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := make(map[string]int)
	for rows.Next() {
		var cat string
		var count int
		if err := rows.Scan(&cat, &count); err != nil {
			return nil, err
		}
		stats[cat] = count
	}
	return stats, nil
}

func (s *RepoStore) Count() (int, error) {
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM repos").Scan(&count)
	return count, err
}
