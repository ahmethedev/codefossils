import { useState } from 'react';
import { useRepos } from './hooks/useRepos';
import Header from './components/Header';
import Controls from './components/Controls';
import Tombstone from './components/Tombstone';
import RepoModal from './components/RepoModal';
import AboutModal from './components/AboutModal';
import SkeletonCard from './components/SkeletonCard';
import CookieBanner from './components/CookieBanner';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [searchText, setSearchText] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
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
          </>
        )}
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
