export default function SkeletonCard({ index }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e8e4de", borderRadius: 14, padding: "24px 22px 20px",
      animationName: "pulse", animationDuration: "2s", animationIterationCount: "infinite",
      animationDelay: `${index * 100}ms`,
    }}>
      <div style={{ width: 28, height: 28, background: "#f0ede8", borderRadius: 6, marginBottom: 14 }} />
      <div style={{ width: "70%", height: 18, background: "#f0ede8", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ width: "100%", height: 13, background: "#f5f2ee", borderRadius: 3, marginBottom: 6 }} />
      <div style={{ width: "85%", height: 13, background: "#f5f2ee", borderRadius: 3, marginBottom: 20 }} />
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ width: 50, height: 20, background: "#f0ede8", borderRadius: 5 }} />
        <div style={{ width: 50, height: 20, background: "#f0ede8", borderRadius: 5 }} />
      </div>
    </div>
  );
}
