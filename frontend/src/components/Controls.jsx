import { CATEGORIES } from '../utils/helpers';

export default function Controls({
  searchText, onSearchChange,
  selectedCategory, onCategoryChange,
  sortBy, onSortChange,
  onRefresh, loading,
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
            onClick={() => onCategoryChange(cat.id)}
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
              onClick={() => onSortChange(s.id)}
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
          onClick={onRefresh}
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
          {"\u21BB"} Excavate more
        </button>
      </div>
    </div>
  );
}
