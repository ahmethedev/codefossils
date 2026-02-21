package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func Connect(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("opening database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("pinging database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	log.Println("Connected to PostgreSQL")
	return db, nil
}

func Migrate(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS repos (
		id              BIGINT PRIMARY KEY,
		name            TEXT NOT NULL,
		full_name       TEXT NOT NULL,
		owner_login     TEXT NOT NULL,
		owner_avatar    TEXT,
		html_url        TEXT NOT NULL,
		description     TEXT,
		language        TEXT,
		topics          TEXT[],
		stargazers      INTEGER NOT NULL DEFAULT 0,
		forks           INTEGER NOT NULL DEFAULT 0,
		pushed_at       TIMESTAMPTZ NOT NULL,
		created_at      TIMESTAMPTZ NOT NULL,
		idea_score      INTEGER NOT NULL DEFAULT 0,
		category        TEXT NOT NULL DEFAULT 'other',
		fetched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);

	CREATE INDEX IF NOT EXISTS idx_repos_category ON repos(category);
	CREATE INDEX IF NOT EXISTS idx_repos_idea_score ON repos(idea_score DESC);
	CREATE INDEX IF NOT EXISTS idx_repos_stargazers ON repos(stargazers DESC);
	CREATE INDEX IF NOT EXISTS idx_repos_pushed_at ON repos(pushed_at ASC);
	CREATE INDEX IF NOT EXISTS idx_repos_fetched_at ON repos(fetched_at);
	`

	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("running migrations: %w", err)
	}

	log.Println("Database migrations applied")
	return nil
}
