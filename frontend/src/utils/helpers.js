export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
  if (years >= 1) return `${years}y ago`;
  if (months >= 1) return `${months}mo ago`;
  return "recently";
}

export function scoreColor(score) {
  if (score >= 70) return "#059669";
  if (score >= 40) return "#d97706";
  return "#6366f1";
}

export function scoreGlowColor(score) {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#818cf8";
}

export const CATEGORIES = [
  { id: "all", label: "All Ideas", icon: "\u26B0\uFE0F" },
  { id: "web", label: "Web Apps", icon: "\uD83C\uDF10" },
  { id: "mobile", label: "Mobile", icon: "\uD83D\uDCF1" },
  { id: "ai", label: "AI / ML", icon: "\uD83E\uDDE0" },
  { id: "dev-tools", label: "Dev Tools", icon: "\uD83D\uDD27" },
  { id: "data", label: "Data", icon: "\uD83D\uDCCA" },
  { id: "game", label: "Games", icon: "\uD83C\uDFAE" },
  { id: "other", label: "Other", icon: "\uD83D\uDC80" },
];
