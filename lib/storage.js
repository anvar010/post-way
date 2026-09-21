const LOCATIONS_KEY = "postway_locations";
const PREFS_KEY = "postway_prefs";
const INSTALL_DISMISSED_KEY = "postway_install_dismissed";

export const defaultPrefs = { navApp: "google", sortMode: "recent" };

export function loadLocations() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocations(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCATIONS_KEY, JSON.stringify(list));
}

export function loadPrefs() {
  if (typeof window === "undefined") return { ...defaultPrefs };
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : { ...defaultPrefs };
  } catch {
    return { ...defaultPrefs };
  }
}

export function savePrefs(prefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function isInstallDismissed() {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(INSTALL_DISMISSED_KEY);
}

export function setInstallDismissed() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
}
