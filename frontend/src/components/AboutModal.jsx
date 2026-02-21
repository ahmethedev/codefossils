export default function AboutModal({ onClose }) {
  const sectionTitle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18, fontWeight: 700, color: "#1a1a2e",
    margin: "0 0 8px",
  };

  const bodyText = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 14, color: "#5a5a78", margin: "0 0 20px", lineHeight: 1.7,
  };

  const categoryChip = {
    display: "inline-block", fontSize: 12, color: "#6a6a88",
    background: "#f0ede8", borderRadius: 6, padding: "3px 10px",
    fontFamily: "'IBM Plex Mono', monospace", margin: "0 6px 6px 0",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animationName: "fadeIn", animationDuration: "0.2s",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff",
          border: "1px solid #e8e4de", borderRadius: 18,
          maxWidth: 560, width: "100%", padding: "32px 30px",
          maxHeight: "85vh", overflow: "auto",
          animationName: "scaleIn", animationDuration: "0.3s",
          animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <img src="/codefossilslogo.png" alt="CodeFossils" style={{ width: 40, height: 40 }} />
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #d8d4cc", borderRadius: 8,
            color: "#8888a0", fontSize: 14, cursor: "pointer", padding: "4px 12px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>{"\u2715"}</button>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 24, fontWeight: 700, color: "#1a1a2e",
          margin: "0 0 20px",
        }}>
          About CodeFossils
        </h2>

        {/* What is CodeFossils? */}
        <h3 style={sectionTitle}>What is CodeFossils?</h3>
        <p style={bodyText}>
          CodeFossils helps you discover abandoned GitHub repositories that contain
          brilliant ideas worth reviving. These are projects that were started with
          passion but left behind — waiting for someone to pick them up, modernize
          them, and bring them to life with today's tools and AI.
        </p>

        {/* How it works */}
        <h3 style={sectionTitle}>How it works</h3>
        <p style={bodyText}>
          We use the GitHub Search API to find repositories that haven't been updated
          in years. Each repo is scored, categorized, and stored in a PostgreSQL
          database. A REST API serves the data to this UI, where you can browse,
          filter, and search through the collection.
        </p>

        {/* Idea Score */}
        <h3 style={sectionTitle}>Idea Score</h3>
        <p style={bodyText}>
          Every repo gets an Idea Score from 0–100 based on signals that suggest a
          promising concept: star count, fork count, whether it has a description,
          and whether topics/tags were added. Higher scores mean the community showed
          interest before the project went dormant.
        </p>

        {/* Categories */}
        <h3 style={sectionTitle}>Categories</h3>
        <div style={{ marginBottom: 20 }}>
          {[
            { icon: "\uD83C\uDF10", label: "Web Apps", desc: "web frameworks, sites, frontends" },
            { icon: "\uD83D\uDCF1", label: "Mobile", desc: "iOS, Android, React Native" },
            { icon: "\uD83E\uDDE0", label: "AI / ML", desc: "machine learning, NLP, data science" },
            { icon: "\uD83D\uDD27", label: "Dev Tools", desc: "CLIs, libraries, build tools" },
            { icon: "\uD83D\uDCCA", label: "Data", desc: "databases, pipelines, visualization" },
            { icon: "\uD83C\uDFAE", label: "Games", desc: "game engines, simulations, fun projects" },
            { icon: "\uD83D\uDC80", label: "Other", desc: "everything else" },
          ].map(c => (
            <span key={c.label} style={categoryChip}>{c.icon} {c.label} — {c.desc}</span>
          ))}
        </div>

        {/* How to use */}
        <h3 style={sectionTitle}>How to use</h3>
        <p style={bodyText}>
          Browse the grid, use category filters to narrow results, or search by name.
          Sort by Idea Score to find the most promising fossils. Click any card to see
          full details — then visit the source repo or fork it to start reviving the idea.
        </p>

        {/* Footer link */}
        <div style={{
          marginTop: 4, padding: "12px 14px", borderRadius: 10,
          background: "#fef9ee", border: "1px dashed #e8dcc8",
          textAlign: "center",
        }}>
          <a
            href="https://github.com/ahmethedev/codefossils"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13, color: "#6366f1", textDecoration: "none",
              fontFamily: "'IBM Plex Mono', monospace",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#4f46e5"}
            onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}
          >
            {"\u2B50"} Star CodeFossils on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
