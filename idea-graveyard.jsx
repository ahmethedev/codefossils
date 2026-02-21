import { useState, useEffect, useCallback, useRef } from "react";

const SEARCH_QUERIES = [
  "abandoned project",
  "prototype NOT maintained",
  "experiment NOT fork",
  "proof of concept",
  "hackathon project",
  "side project",
  "weekend project",
  "toy project idea",
  "mvp startup",
  "concept app",
];

const CATEGORIES = [
  { id: "all", label: "All Ideas", icon: "⚰️" },
  { id: "web", label: "Web Apps", icon: "🌐" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "ai", label: "AI / ML", icon: "🧠" },
  { id: "dev-tools", label: "Dev Tools", icon: "🔧" },
  { id: "data", label: "Data", icon: "📊" },
  { id: "game", label: "Games", icon: "🎮" },
  { id: "other", label: "Other", icon: "💀" },
];

function categorizeRepo(repo) {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")} ${repo.language || ""}`.toLowerCase();
  if (/\b(react|vue|angular|svelte|next|nuxt|web\s?app|frontend|dashboard|website|html|css|django|flask|rails|express)\b/.test(text)) return "web";
  if (/\b(ios|android|flutter|react.native|swift|kotlin|mobile)\b/.test(text)) return "mobile";
  if (/\b(machine.learning|deep.learning|neural|nlp|gpt|llm|ai|ml|tensorflow|pytorch|model|transformer|diffusion)\b/.test(text)) return "ai";
  if (/\b(cli|sdk|api|library|framework|plugin|extension|tool|linter|compiler|devtool|package)\b/.test(text)) return "dev-tools";
  if (/\b(data|analytics|scraper|crawler|etl|pipeline|database|visualization|chart)\b/.test(text)) return "data";
  if (/\b(game|unity|godot|phaser|rpg|puzzle|arcade|gameplay)\b/.test(text)) return "game";
  return "other";
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
  if (years >= 1) return `${years}y ago`;
  if (months >= 1) return `${months}mo ago`;
  return "recently";
}

function ideaScore(repo) {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const hasDesc = repo.description ? 1 : 0;
  const descLen = (repo.description || "").length;
  const hasTopics = (repo.topics || []).length > 0 ? 1 : 0;
  return Math.min(100, Math.round(
    (Math.log2(stars + 1) * 8) +
    (Math.log2(forks + 1) * 4) +
    (hasDesc * 10) +
    (Math.min(descLen, 120) / 12) +
    (hasTopics * 5)
  ));
}

function ScoreBadge({ score }) {
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#94a3b8";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: `${color}15`, border: `1px solid ${color}40`,
      borderRadius: 6, padding: "2px 8px", fontSize: 12, color,
      fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
    }}>
      <span style={{ fontSize: 8, opacity: 0.7 }}>◆</span> {score}
    </div>
  );
}

function Tombstone({ repo, index, onClick }) {
  const category = categorizeRepo(repo);
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[7];
  const score = ideaScore(repo);
  const pushed = timeAgo(repo.pushed_at);
  const lang = repo.language;

  return (
    <div
      onClick={onClick}
      style={{
        background: "linear-gradient(165deg, #1a1a2e 0%, #16162a 50%, #0f0f1e 100%)",
        border: "1px solid #2a2a4a",
        borderRadius: 14,
        padding: "24px 22px 20px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        animationName: "fadeSlideIn",
        animationDuration: "0.5s",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        animationFillMode: "both",
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid #4a4a7a";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(100, 80, 200, 0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid #2a2a4a";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#6366f1"}40, transparent)`,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{cat.icon}</span>
        <ScoreBadge score={score} />
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 17, fontWeight: 700, color: "#e2e0f0",
        margin: "0 0 6px", lineHeight: 1.3,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {repo.name.replace(/[-_]/g, " ")}
      </h3>

      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 13, color: "#8888aa", margin: "0 0 16px",
        lineHeight: 1.55, minHeight: 40,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {repo.description || "No description — the idea lies buried, waiting to be unearthed."}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {(repo.topics || []).slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: 11, color: "#7a7a9a", background: "#1e1e38",
            borderRadius: 5, padding: "2px 8px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>{t}</span>
        ))}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid #1e1e38",
      }}>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6a6a8a", fontFamily: "'IBM Plex Mono', monospace" }}>
          <span>★ {repo.stargazers_count}</span>
          <span>⑂ {repo.forks_count}</span>
          {lang && <span style={{ color: "#8888cc" }}>{lang}</span>}
        </div>
        <span style={{ fontSize: 11, color: "#555578", fontFamily: "'IBM Plex Mono', monospace" }}>
          ☠ {pushed}
        </span>
      </div>
    </div>
  );
}

function RepoModal({ repo, onClose }) {
  if (!repo) return null;
  const score = ideaScore(repo);
  const cat = CATEGORIES.find(c => c.id === categorizeRepo(repo)) || CATEGORIES[7];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(5,5,15,0.85)",
        backdropFilter: "blur(8px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animationName: "fadeIn", animationDuration: "0.2s",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(170deg, #1a1a2e, #12122a)",
          border: "1px solid #2a2a4a", borderRadius: 18,
          maxWidth: 560, width: "100%", padding: "32px 30px",
          maxHeight: "85vh", overflow: "auto",
          animationName: "scaleIn", animationDuration: "0.3s",
          animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>{cat.icon}</span>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #2a2a4a", borderRadius: 8,
            color: "#6a6a8a", fontSize: 14, cursor: "pointer", padding: "4px 12px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>✕</button>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 24, fontWeight: 700, color: "#e8e6f4",
          margin: "0 0 8px",
        }}>
          {repo.name.replace(/[-_]/g, " ")}
        </h2>

        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 15, color: "#9999bb", margin: "0 0 20px", lineHeight: 1.6,
        }}>
          {repo.description || "This project had no description — a mystery waiting to be solved."}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20,
        }}>
          {[
            { label: "Stars", value: repo.stargazers_count, icon: "★" },
            { label: "Forks", value: repo.forks_count, icon: "⑂" },
            { label: "Idea Score", value: score + "/100", icon: "◆" },
            { label: "Last Active", value: timeAgo(repo.pushed_at), icon: "☠" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#12122a", borderRadius: 10, padding: "12px 14px",
              border: "1px solid #1e1e38",
            }}>
              <div style={{ fontSize: 11, color: "#6a6a8a", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: 18, color: "#d0cee8", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {(repo.topics || []).length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {repo.topics.map(t => (
              <span key={t} style={{
                fontSize: 12, color: "#8888bb", background: "#1a1a34",
                borderRadius: 6, padding: "3px 10px",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "12px 16px", borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", textDecoration: "none", fontSize: 14,
              fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            View Source Repo →
          </a>
          <a
            href={`https://github.com/${repo.full_name}/blob/HEAD/README.md`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "12px 16px", borderRadius: 10,
              background: "transparent", border: "1px solid #2a2a4a",
              color: "#8888cc", textDecoration: "none", fontSize: 14,
              fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#4a4a7a"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
          >
            README
          </a>
        </div>

        <div style={{
          marginTop: 16, padding: "12px 14px", borderRadius: 10,
          background: "#0f0f1e", border: "1px dashed #2a2a4a",
        }}>
          <p style={{
            fontSize: 12, color: "#6a6a8a", margin: 0,
            fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.5,
          }}>
            💡 <strong style={{ color: "#8888bb" }}>Revive this idea:</strong> Fork the repo, use AI to rebuild it with modern tools, and ship what the original creator dreamed of.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ index }) {
  return (
    <div style={{
      background: "linear-gradient(165deg, #1a1a2e 0%, #16162a 50%, #0f0f1e 100%)",
      border: "1px solid #1e1e38", borderRadius: 14, padding: "24px 22px 20px",
      animationName: "pulse", animationDuration: "2s", animationIterationCount: "infinite",
      animationDelay: `${index * 100}ms`,
    }}>
      <div style={{ width: 28, height: 28, background: "#1e1e38", borderRadius: 6, marginBottom: 14 }} />
      <div style={{ width: "70%", height: 18, background: "#1e1e38", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ width: "100%", height: 13, background: "#1a1a30", borderRadius: 3, marginBottom: 6 }} />
      <div style={{ width: "85%", height: 13, background: "#1a1a30", borderRadius: 3, marginBottom: 20 }} />
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ width: 50, height: 20, background: "#1a1a30", borderRadius: 5 }} />
        <div style={{ width: 50, height: 20, background: "#1a1a30", borderRadius: 5 }} />
      </div>
    </div>
  );
}

export default function IdeaGraveyard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [searchText, setSearchText] = useState("");
  const fetchedRef = useRef(false);

  const fetchStaleRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      const dateStr = twoYearsAgo.toISOString().split("T")[0];

      const queries = SEARCH_QUERIES.sort(() => Math.random() - 0.5).slice(0, 3);
      const allRepos = [];

      for (const q of queries) {
        try {
          const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}+pushed:<${dateStr}+stars:>5&sort=stars&order=desc&per_page=30`;
          const res = await fetch(url, {
            headers: { "Accept": "application/vnd.github.mercy-preview+json" },
          });
          if (!res.ok) {
            if (res.status === 403) throw new Error("rate_limit");
            continue;
          }
          const data = await res.json();
          if (data.items) allRepos.push(...data.items);
        } catch (e) {
          if (e.message === "rate_limit") throw e;
        }
      }

      const seen = new Set();
      const unique = allRepos.filter(r => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });

      unique.sort((a, b) => ideaScore(b) - ideaScore(a));
      setRepos(unique);
    } catch (e) {
      if (e.message === "rate_limit") {
        setError("GitHub API rate limit hit. Try again in a minute — or sign in to GitHub for higher limits.");
      } else {
        setError("Failed to fetch repos. Check your connection and try again.");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchStaleRepos();
    }
  }, [fetchStaleRepos]);

  const filtered = repos
    .filter(r => selectedCategory === "all" || categorizeRepo(r) === selectedCategory)
    .filter(r => {
      if (!searchText) return true;
      const s = searchText.toLowerCase();
      return (
        r.name.toLowerCase().includes(s) ||
        (r.description || "").toLowerCase().includes(s) ||
        (r.topics || []).some(t => t.includes(s))
      );
    })
    .sort((a, b) => {
      if (sortBy === "score") return ideaScore(b) - ideaScore(a);
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "oldest") return new Date(a.pushed_at) - new Date(b.pushed_at);
      return 0;
    });

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, #12122e 0%, #0a0a18 50%, #050510 100%)",
      color: "#e2e0f0",
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes drift {
          0% { transform: translateX(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(20px) rotate(5deg); opacity: 0; }
        }

        * { box-sizing: border-box; }
        body { margin: 0; background: #050510; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
        
        input::placeholder { color: #4a4a6a; }
      `}</style>

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

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 1,
        padding: "48px 24px 32px",
        textAlign: "center",
        borderBottom: "1px solid #1a1a30",
      }}>
        <div style={{
          fontSize: 48, marginBottom: 12,
          animationName: "float", animationDuration: "4s", animationIterationCount: "infinite",
        }}>
          🪦
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900,
          margin: "0 0 8px",
          background: "linear-gradient(135deg, #e8e6f4, #a8a6d4, #6366f1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
        }}>
          IdeaGraveyard
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "clamp(14px, 2vw, 17px)",
          color: "#7777aa",
          margin: "0 auto",
          maxWidth: 480,
          lineHeight: 1.6,
          fontWeight: 300,
        }}>
          Where abandoned repos rest — and brilliant ideas await resurrection.
          <br />
          <span style={{ fontSize: 13, color: "#555578" }}>
            Discover stale GitHub projects worth reviving with modern AI tools.
          </span>
        </p>
      </header>

      {/* Controls */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1100, margin: "0 auto",
        padding: "24px 24px 0",
      }}>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search buried ideas..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{
              width: "100%", maxWidth: 420,
              padding: "10px 16px",
              background: "#12122a",
              border: "1px solid #2a2a4a",
              borderRadius: 10,
              color: "#d0cee8",
              fontSize: 14,
              fontFamily: "'IBM Plex Sans', sans-serif",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#4a4a7a"}
            onBlur={e => e.target.style.borderColor = "#2a2a4a"}
          />
        </div>

        {/* Category pills */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 14px",
                borderRadius: 8,
                border: selectedCategory === cat.id ? "1px solid #6366f1" : "1px solid #1e1e38",
                background: selectedCategory === cat.id ? "#6366f118" : "#12122a",
                color: selectedCategory === cat.id ? "#a5a3f0" : "#6a6a8a",
                fontSize: 13,
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort + refresh */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "score", label: "Best Ideas" },
              { id: "stars", label: "Most Stars" },
              { id: "oldest", label: "Most Stale" },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                  background: sortBy === s.id ? "#1e1e3a" : "transparent",
                  border: sortBy === s.id ? "1px solid #3a3a5a" : "1px solid transparent",
                  color: sortBy === s.id ? "#b0b0d0" : "#555578",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { fetchedRef.current = false; fetchStaleRepos(); }}
            disabled={loading}
            style={{
              padding: "6px 16px", borderRadius: 8,
              background: "transparent", border: "1px solid #2a2a4a",
              color: "#7777aa", fontSize: 13,
              fontFamily: "'IBM Plex Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            ↻ Dig up more
          </button>
        </div>
      </div>

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
            <div style={{ fontSize: 36, marginBottom: 12 }}>💀</div>
            <p style={{ fontSize: 15 }}>{error}</p>
            <button
              onClick={() => { fetchedRef.current = false; fetchStaleRepos(); }}
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

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6a6a8a" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🕳️</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#8888aa" }}>
              Nothing buried here... yet.
            </p>
            <p style={{ fontSize: 14 }}>Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p style={{
              fontSize: 12, color: "#555578", marginBottom: 16,
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {filtered.length} buried idea{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {filtered.map((repo, i) => (
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
          fontSize: 12, color: "#3a3a5a", margin: 0,
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          🪦 IdeaGraveyard — Every abandoned repo has a story. Give it a second life.
        </p>
      </footer>

      {/* Modal */}
      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
