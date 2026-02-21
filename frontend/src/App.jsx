import { useState } from 'react';
import { useRepos } from './hooks/useRepos';
import Header from './components/Header';
import Controls from './components/Controls';
import Tombstone from './components/Tombstone';
import RepoModal from './components/RepoModal';
import SkeletonCard from './components/SkeletonCard';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [searchText, setSearchText] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [page, setPage] = useState(1);

  const { repos, total, loading, error, refresh } = useRepos({
    category: selectedCategory,
    sort: sortBy,
    search: searchText,
    page,
  });

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    setPage(1);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, #12122e 0%, #0a0a18 50%, #050510 100%)",
      color: "#e2e0f0",
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    }}>
      {/* Floating particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i * 10) % 70}%`,
            width: 3, height: 3,
            background: "#6366f130",
            borderRadius: "50%",
            animationName: "float",
            animationDuration: `${3 + i * 0.7}s`,
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      <Header />

      <Controls
        searchText={searchText}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onRefresh={refresh}
        loading={loading}
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
            color: "#ff6b6b", fontFamily: "'IBM Plex Sans', sans-serif",
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

        {loading && (
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
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6a6a8a" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83D\uDD73\uFE0F"}</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#8888aa" }}>
              No fossils found here... yet.
            </p>
            <p style={{ fontSize: 14 }}>Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <>
            <p style={{
              fontSize: 12, color: "#555578", marginBottom: 16,
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid #1a1a30",
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 12, color: "#3a3a5a", margin: "0 0 8px",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          {"\uD83E\uDD96"} CodeFossils — Every abandoned repo has a story. Give it a second life.
        </p>
        <a
          href="https://github.com/ahmethedev/codefossils"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#555578", textDecoration: "none",
            fontFamily: "'IBM Plex Mono', monospace",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#8888cc"}
          onMouseLeave={e => e.currentTarget.style.color = "#555578"}
        >
          {"\u2B50"} Star us on GitHub
        </a>
      </footer>

      {/* Modal */}
      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
