import { scoreColor } from '../utils/helpers';

export default function ScoreBadge({ score }) {
  const color = scoreColor(score);
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
