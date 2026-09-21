export function buildDirectionsUrl(loc, navApp) {
  if (navApp === "apple") {
    return `https://maps.apple.com/?daddr=${loc.lat},${loc.lng}&dirflg=d`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
}

export function buildShareUrl(loc) {
  return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
}

export async function shareLocation(loc) {
  const text = `${loc.name}${loc.description ? ` — ${loc.description}` : ""}`;
  const url = buildShareUrl(loc);

  if (navigator.share) {
    try {
      await navigator.share({ title: loc.name, text, url });
      return { ok: true, method: "share" };
    } catch (err) {
      if (err && err.name === "AbortError") return { ok: false, method: "share", cancelled: true };
      // fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return { ok: true, method: "clipboard" };
  } catch {
    return { ok: false, method: "clipboard" };
  }
}
