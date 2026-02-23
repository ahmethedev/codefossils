import { useState, useEffect, useRef } from 'react';
import { useRepos } from './hooks/useRepos';
import Header from './components/Header';
import Controls from './components/Controls';
import Tombstone from './components/Tombstone';
import RepoModal from './components/RepoModal';
import ReelsView from './components/ReelsView';
import AboutModal from './components/AboutModal';
import SkeletonCard from './components/SkeletonCard';
import CookieBanner from './components/CookieBanner';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [searchText, setSearchText] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const { repos, total, loading, loadingMore, refreshing, error, refresh, hasMore, loadMore } = useRepos({
    category: selectedCategory,
    sort: sortBy,
    search: searchText,
  });

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f4",
      color: "#1a1a2e",
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    }}>
      {/* Floating particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i * 10) % 70}%`,
            width: 4, height: 4,
            background: i % 3 === 0 ? "#f59e0b30" : i % 3 === 1 ? "#818cf830" : "#10b98128",
            borderRadius: "50%",
            animationName: "float",
            animationDuration: `${3 + i * 0.7}s`,
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      <Header onAboutClick={() => setShowAbout(true)} />

      <Controls
        searchText={searchText}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onRefresh={refresh}
        loading={loading}
        refreshing={refreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Grid */}
      <main style={{
        position: "relative", zIndex: 1,
        maxWidth: 1100, margin: "0 auto",
        padding: "0 24px 60px",
      }}>
        {error && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "#dc2626", fontFamily: "'IBM Plex Sans', sans-serif",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83D\uDC80"}</div>
            <p style={{ fontSize: 15 }}>{error}</p>
            <button
              onClick={refresh}
              style={{
                marginTop: 12, padding: "8px 20px", borderRadius: 8,
                background: "#6366f1", border: "none", color: "#fff",
                fontSize: 14, cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {loading && !refreshing && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#8888a0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83D\uDD73\uFE0F"}</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#5a5a78" }}>
              No fossils found here... yet.
            </p>
            <p style={{ fontSize: 14 }}>Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <>
            <p style={{
              fontSize: 12, color: "#8888a0", marginBottom: 16,
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {total} fossil{total !== 1 ? "s" : ""} found
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {repos.map((repo, i) => (
                <Tombstone
                  key={repo.id}
                  repo={repo}
                  index={i}
                  onClick={() => setSelectedRepo(repo)}
                />
              ))}
            </div>

            {loadingMore && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "20px 0 0", gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36,
                  border: "3px solid #e8e4de",
                  borderTopColor: "#6366f1",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p style={{
                  fontSize: 13, color: "#8888a0", margin: 0,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Unearthing more fossils...
                </p>
              </div>
            )}
          </>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid #e8e4de",
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 12, color: "#a0a0b4", margin: "0 0 8px",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          <img src="/codefossilslogo.png" alt="CodeFossils" style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 4 }} /> CodeFossils — Every abandoned repo has a story. Give it a second life.
        </p>
        <a
          href="https://github.com/ahmethedev/codefossils"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#6a6a88", textDecoration: "none",
            fontFamily: "'IBM Plex Mono', monospace",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#4f46e5"}
          onMouseLeave={e => e.currentTarget.style.color = "#6a6a88"}
        >
          {"\u2B50"} Star us on GitHub
        </a>
      </footer>

      {/* Reels mode */}
      {viewMode === "reels" && !loading && repos.length > 0 && (
        <ReelsView
          repos={repos}
          loadMore={loadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onClose={() => setViewMode("grid")}
        />
      )}

      {/* Modal */}
      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
      <CookieBanner />
    </div>
  );
}
