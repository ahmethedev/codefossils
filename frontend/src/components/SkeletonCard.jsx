export default function SkeletonCard({ index }) {
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
