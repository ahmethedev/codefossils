package config

import (
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port            string
	DatabaseURL     string
	GitHubToken     string
	RefreshInterval time.Duration
}

func Load() (*Config, error) {
	// Try .env in current dir, then parent dir (project root)
	_ = godotenv.Load()
	_ = godotenv.Load("../.env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://codefossils:codefossils@localhost:5432/codefossils?sslmode=disable"
	}

	refreshStr := os.Getenv("REFRESH_INTERVAL")
	if refreshStr == "" {
		refreshStr = "6h"
	}
	refreshInterval, err := time.ParseDuration(refreshStr)
	if err != nil {
		refreshInterval = 6 * time.Hour
	}

	return &Config{
		Port:            port,
		DatabaseURL:     dbURL,
		GitHubToken:     os.Getenv("GITHUB_TOKEN"),
		RefreshInterval: refreshInterval,
	}, nil
}
