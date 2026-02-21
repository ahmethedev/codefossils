import { CATEGORIES, timeAgo, scoreGlowColor } from '../utils/helpers';
import ScoreBadge from './ScoreBadge';

export default function Tombstone({ repo, index, onClick }) {
  const cat = CATEGORIES.find(c => c.id === repo.category) || CATEGORIES[7];
  const score = repo.idea_score;
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
        background: `linear-gradient(90deg, transparent, ${scoreGlowColor(score)}40, transparent)`,
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
        {repo.description || "No description \u2014 an ancient fossil, waiting to be excavated."}
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
          <span>{"\u2605"} {repo.stargazers_count}</span>
          <span>{"\u2442"} {repo.forks_count}</span>
          {lang && <span style={{ color: "#8888cc" }}>{lang}</span>}
        </div>
        <span style={{ fontSize: 11, color: "#555578", fontFamily: "'IBM Plex Mono', monospace" }}>
          {"\u2620"} {pushed}
        </span>
      </div>
    </div>
  );
}
