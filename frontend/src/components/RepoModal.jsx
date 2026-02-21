import { CATEGORIES, timeAgo } from '../utils/helpers';

export default function RepoModal({ repo, onClose }) {
  if (!repo) return null;
  const cat = CATEGORIES.find(c => c.id === repo.category) || CATEGORIES[7];
  const score = repo.idea_score;

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
          }}>{"\u2715"}</button>
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
          {repo.description || "This project had no description \u2014 an ancient fossil waiting to be studied."}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20,
        }}>
          {[
            { label: "Stars", value: repo.stargazers_count, icon: "\u2605" },
            { label: "Forks", value: repo.forks_count, icon: "\u2442" },
            { label: "Idea Score", value: score + "/100", icon: "\u25C6" },
            { label: "Last Active", value: timeAgo(repo.pushed_at), icon: "\u2620" },
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
            View Source Repo {"\u2192"}
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
            {"\uD83D\uDCA1"} <strong style={{ color: "#8888bb" }}>Revive this idea:</strong> Fork the repo, use AI to rebuild it with modern tools, and ship what the original creator dreamed of.
          </p>
        </div>
      </div>
    </div>
  );
}
