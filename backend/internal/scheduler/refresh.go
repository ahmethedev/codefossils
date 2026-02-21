package scheduler

import (
	"log"
	"time"

	"github.com/ahmetburakdinc/codefossils/internal/database"
	"github.com/ahmetburakdinc/codefossils/internal/handlers"
)

type Scheduler struct {
	handler  *handlers.RepoHandler
	store    *database.RepoStore
	interval time.Duration
}

func New(handler *handlers.RepoHandler, store *database.RepoStore, interval time.Duration) *Scheduler {
	return &Scheduler{
		handler:  handler,
		store:    store,
		interval: interval,
	}
}

func (s *Scheduler) Start() {
	// Check if DB is empty and do initial fetch
	count, err := s.store.Count()
	if err != nil {
		log.Printf("Error checking repo count: %v", err)
	}

	if count == 0 {
		log.Println("Database is empty, triggering initial fetch...")
		s.handler.DoRefreshSync()
	} else {
		log.Printf("Database has %d repos, skipping initial fetch", count)
	}

	// Start periodic refresh
	go func() {
		ticker := time.NewTicker(s.interval)
		defer ticker.Stop()

		log.Printf("Scheduler started: refreshing every %s", s.interval)

		for range ticker.C {
			log.Println("Scheduled refresh triggered")
			s.handler.DoRefreshSync()
		}
	}()
}
