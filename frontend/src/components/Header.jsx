export default function Header({ onAboutClick }) {
  return (
    <header style={{
      position: "relative", zIndex: 1,
      padding: "48px 24px 32px",
      textAlign: "center",
      borderBottom: "1px solid #e8e4de",
    }}>
      <div style={{
        fontSize: 48, marginBottom: 12,
        animationName: "float", animationDuration: "4s", animationIterationCount: "infinite",
      }}>
        {"\uD83E\uDD96"}
      </div>
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(32px, 5vw, 52px)",
        fontWeight: 900,
        margin: "0 0 8px",
        background: "linear-gradient(135deg, #4f46e5, #6366f1, #d97706)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-1px",
      }}>
        CodeFossils
      </h1>
      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "clamp(14px, 2vw, 17px)",
        color: "#5a5a78",
        margin: "0 auto",
        maxWidth: 480,
        lineHeight: 1.6,
        fontWeight: 300,
      }}>
        Where ancient code rests — and brilliant ideas await excavation.
        <br />
        <span style={{ fontSize: 13, color: "#8888a0" }}>
          Unearth forgotten GitHub projects worth reviving with modern AI tools.
        </span>
      </p>
      <button
        onClick={onAboutClick}
        style={{
          marginTop: 14,
          padding: "6px 18px",
          borderRadius: 8,
          background: "transparent",
          border: "1px solid #d8d4cc",
          color: "#6a6a88",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#4f46e5"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8d4cc"; e.currentTarget.style.color = "#6a6a88"; }}
      >
        About
      </button>
    </header>
  );
}
