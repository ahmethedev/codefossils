package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/ahmetburakdinc/codefossils/internal/database"
	"github.com/ahmetburakdinc/codefossils/internal/github"
	"github.com/ahmetburakdinc/codefossils/internal/models"
)

const refreshCooldown = 5 * time.Minute

type RepoHandler struct {
	store         *database.RepoStore
	ghClient      *github.Client
	mu            sync.Mutex
	lastRefreshAt time.Time
}

func NewRepoHandler(store *database.RepoStore, ghClient *github.Client) *RepoHandler {
	return &RepoHandler{
		store:    store,
		ghClient: ghClient,
	}
}

var validCategories = map[string]bool{
	"all": true, "web": true, "mobile": true, "ai": true,
	"dev-tools": true, "data": true, "game": true, "other": true,
}

func (h *RepoHandler) ListRepos(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	category := q.Get("category")
	sort := q.Get("sort")
	search := q.Get("search")

	// Validate category
	if category != "" && !validCategories[category] {
		category = ""
	}

	// Cap search length
	if len(search) > 100 {
		search = search[:100]
	}

	page, _ := strconv.Atoi(q.Get("page"))
	if page < 1 {
		page = 1
	}
	if page > 1000 {
		page = 1000
	}
	perPage, _ := strconv.Atoi(q.Get("per_page"))
	if perPage < 1 || perPage > 100 {
		perPage = 30
	}

	repos, total, err := h.store.Query(category, sort, search, page, perPage)
	if err != nil {
		log.Printf("Error querying repos: %v", err)
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	resp := models.RepoListResponse{
		Repos:   repos,
		Total:   total,
		Page:    page,
		PerPage: perPage,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *RepoHandler) RefreshRepos(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// Cooldown check — reject if last refresh was less than 5 minutes ago
	h.mu.Lock()
	sinceLastRefresh := time.Since(h.lastRefreshAt)
	if sinceLastRefresh < refreshCooldown {
		remaining := refreshCooldown - sinceLastRefresh
		h.mu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error":      "refresh on cooldown",
			"retry_after": int(remaining.Seconds()),
		})
		return
	}
	h.lastRefreshAt = time.Now()
	h.mu.Unlock()

	// Concurrency check — only one refresh at a time
	if !h.mu.TryLock() {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "refresh already in progress"})
		return
	}

	go func() {
		defer h.mu.Unlock()
		h.doRefresh()
	}()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "refresh started"})
}

func (h *RepoHandler) doRefresh() {
	repos, err := h.ghClient.FetchStaleRepos()
	if err != nil {
		log.Printf("Error fetching from GitHub: %v", err)
	}
	if len(repos) > 0 {
		count, err := h.store.UpsertBatch(repos)
		if err != nil {
			log.Printf("Error upserting repos: %v", err)
		} else {
			log.Printf("Upserted %d repos", count)
		}
	}
}

func (h *RepoHandler) Stats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.store.Stats()
	if err != nil {
		log.Printf("Error getting stats: %v", err)
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	total := 0
	for _, count := range stats {
		total += count
	}

	resp := models.StatsResponse{
		Categories: stats,
		Total:      total,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// DoRefreshSync performs a synchronous refresh (used by scheduler).
func (h *RepoHandler) DoRefreshSync() {
	if !h.mu.TryLock() {
		log.Println("Refresh already in progress, skipping scheduled refresh")
		return
	}
	defer h.mu.Unlock()
	h.doRefresh()
}
