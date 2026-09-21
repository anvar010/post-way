export function fmtCoord(v) {
  return typeof v === "number" ? v.toFixed(5) : "—";
}

export function formatSavedDate(iso) {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `Saved ${dateStr} at ${timeStr}`;
}

export function relativeUpdated(ts) {
  const secs = Math.round((Date.now() - ts) / 1000);
  if (secs < 10) return "Updated just now";
  if (secs < 60) return `Updated ${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `Updated ${mins} min ago`;
  return "Updated a while ago";
}

export function formatDistance(miles) {
  if (miles == null || Number.isNaN(miles)) return null;
  if (miles < 0.1) return "Nearby";
  if (miles < 10) return `${miles.toFixed(1)} mi away`;
  return `${Math.round(miles)} mi away`;
}

export function uid() {
  return `loc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
