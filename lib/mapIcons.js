import L from "leaflet";

export function liveIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="wp-marker"><span class="wp-marker-pulse"></span><span class="wp-marker-dot"></span></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export function pinIcon(color = "#8E1F2B", { active = false } = {}) {
  const size = active ? 36 : 30;
  const h = active ? 46 : 38;
  return L.divIcon({
    className: "",
    html: `<svg class="wp-pin" viewBox="0 0 30 38" width="${size}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C7 0 1 6.2 1 13.8 1 24 15 38 15 38s14-14 14-24.2C29 6.2 23 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="14" r="5.5" fill="#fff"/>
    </svg>`,
    iconSize: [size, h],
    iconAnchor: [size / 2, h],
  });
}

export const DEFAULT_CENTER = [40.7128, -74.006];
