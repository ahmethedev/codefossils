package main

import (
	"log"
	"net/http"

	"github.com/ahmetburakdinc/codefossils/internal/config"
	"github.com/ahmetburakdinc/codefossils/internal/database"
	"github.com/ahmetburakdinc/codefossils/internal/github"
	"github.com/ahmetburakdinc/codefossils/internal/handlers"
	"github.com/ahmetburakdinc/codefossils/internal/scheduler"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	store := database.NewRepoStore(db)
	ghClient := github.NewClient(cfg.GitHubToken)
	repoHandler := handlers.NewRepoHandler(store, ghClient)

	// Start background scheduler
	sched := scheduler.New(repoHandler, store, cfg.RefreshInterval)
	sched.Start()

	// Routes
	mux := http.NewServeMux()
	mux.HandleFunc("/api/repos", corsMiddleware(repoHandler.ListRepos))
	mux.HandleFunc("/api/repos/refresh", corsMiddleware(repoHandler.RefreshRepos))
	mux.HandleFunc("/api/stats", corsMiddleware(repoHandler.Stats))

	log.Printf("Server starting on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}
