import { CATEGORIES } from '../utils/helpers';

export default function Controls({
  searchText, onSearchChange,
  selectedCategory, onCategoryChange,
  sortBy, onSortChange,
  onRefresh, loading, refreshing,
  viewMode, onViewModeChange,
}) {
  return (
    <div style={{
      position: "relative", zIndex: 1,
      maxWidth: 1100, margin: "0 auto",
      padding: "24px 24px 0",
    }}>
      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search fossils..."
          value={searchText}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            width: "100%", maxWidth: 420,
            padding: "10px 16px",
            background: "#ffffff",
            border: "1px solid #d8d4cc",
            borderRadius: 10,
            color: "#1a1a2e",
            fontSize: 14,
            fontFamily: "'IBM Plex Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#d8d4cc"}
        />
      </div>

      {/* Category pills */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16,
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 14px",
              borderRadius: 8,
              border: selectedCategory === cat.id ? "1px solid #6366f1" : "1px solid #ddd8d0",
              background: selectedCategory === cat.id ? "#eef2ff" : "#ffffff",
              color: selectedCategory === cat.id ? "#4f46e5" : "#6a6a88",
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
            { id: "latest", label: "Latest" },
            { id: "score", label: "Best Ideas" },
            { id: "stars", label: "Most Stars" },
            { id: "oldest", label: "Most Stale" },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 12,
                fontFamily: "'IBM Plex Mono', monospace",
                background: sortBy === s.id ? "#eef2ff" : "transparent",
                border: sortBy === s.id ? "1px solid #c7d2fe" : "1px solid transparent",
                color: sortBy === s.id ? "#4338ca" : "#8888a0",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* View mode toggle */}
          <div style={{
            display: "flex",
            border: "1px solid #d8d4cc",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <button
              onClick={() => onViewModeChange("grid")}
              title="Grid view"
              style={{
                padding: "6px 10px", border: "none",
                background: viewMode === "grid" ? "#eef2ff" : "transparent",
                color: viewMode === "grid" ? "#4338ca" : "#8888a0",
                fontSize: 14, cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "all 0.2s",
                borderRight: "1px solid #d8d4cc",
              }}
            >
              {"\u25A6"}
            </button>
            <button
              onClick={() => onViewModeChange("reels")}
              title="Reels view"
              style={{
                padding: "6px 10px", border: "none",
                background: viewMode === "reels" ? "#eef2ff" : "transparent",
                color: viewMode === "reels" ? "#4338ca" : "#8888a0",
                fontSize: 14, cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "all 0.2s",
              }}
            >
              {"\u25AE"}
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            style={{
              padding: "6px 16px", borderRadius: 8,
              background: refreshing ? "#eef2ff" : "transparent",
              border: refreshing ? "1px solid #c7d2fe" : "1px solid #d8d4cc",
              color: refreshing ? "#4338ca" : "#5a5a78",
              fontSize: 13,
              fontFamily: "'IBM Plex Sans', sans-serif",
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.85 : 1,
              transition: "all 0.2s",
            }}
          >
            <span style={{
              display: "inline-block",
              animation: refreshing ? "spin 1s linear infinite" : "none",
            }}>
              {"\u21BB"}
            </span>
            {refreshing ? " Digging..." : " Excavate more"}
          </button>
        </div>
      </div>
    </div>
  );
}
