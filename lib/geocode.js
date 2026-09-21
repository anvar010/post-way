import { fmtCoord } from "./format";

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error("geocode failed");
    const data = await res.json();
    if (data && data.display_name) {
      const a = data.address || {};
      const short = [
        a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road || a.suburb || a.neighbourhood,
        a.city || a.town || a.village || a.county,
      ]
        .filter(Boolean)
        .join(", ");
      return short || data.display_name;
    }
    throw new Error("no result");
  } catch {
    return `${fmtCoord(lat)}, ${fmtCoord(lng)}`;
  }
}
