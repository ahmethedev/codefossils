export default function Header() {
  return (
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
        {"\uD83E\uDD96"}
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
        CodeFossils
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
        Where ancient code rests — and brilliant ideas await excavation.
        <br />
        <span style={{ fontSize: 13, color: "#555578" }}>
          Unearth forgotten GitHub projects worth reviving with modern AI tools.
        </span>
      </p>
    </header>
  );
}
