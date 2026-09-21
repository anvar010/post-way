"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./BottomNav";
import HomeView from "./HomeView";
import SavedView from "./SavedView";
import SettingsView from "./SettingsView";
import SaveSheet from "./SaveSheet";
import DetailSheet from "./DetailSheet";
import EditSheet from "./EditSheet";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";
import InstallBanner from "./InstallBanner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReminders } from "@/hooks/useReminders";
import { loadLocations, saveLocations, loadPrefs, savePrefs, isInstallDismissed, setInstallDismissed } from "@/lib/storage";
import { uid } from "@/lib/format";
import { haversineMiles } from "@/lib/distance";
import { buildDirectionsUrl } from "@/lib/directions";

export default function PostWayApp() {
  const [view, setView] = useState("home");
  const [locations, setLocations] = useState([]);
  const [prefs, setPrefs] = useState({ navApp: "google", sortMode: "recent" });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [saveOpen, setSaveOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);
  const [recenterToken, setRecenterToken] = useState(0);

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [installBannerVisible, setInstallBannerVisible] = useState(false);

  const geo = useGeolocation();

  useEffect(() => {
    setLocations(loadLocations());
    setPrefs(loadPrefs());
  }, []);

  const showToast = useCallback((text) => {
    setToastMessage(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2400);
  }, []);

  // Reminders: check periodically while the app is open.
  const handleReminderDue = useCallback(
    (loc) => {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("Post-Way reminder", { body: loc.name, tag: loc.id });
        } catch {
          showToast(`Reminder: ${loc.name}`);
        }
      } else {
        showToast(`Reminder: ${loc.name}`);
      }
    },
    [showToast]
  );
  useReminders(locations, handleReminderDue);

  // App shortcut ("Save current location", from the manifest) and the
  // regular Save button both want the same behavior: open the save sheet
  // immediately if we already have a position, otherwise open it as soon
  // as one arrives.
  const pendingSaveIntent = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "save") {
      setView("home");
      window.history.replaceState({}, "", window.location.pathname);
      pendingSaveIntent.current = true;
    }
  }, []);
  useEffect(() => {
    if (pendingSaveIntent.current && geo.status === "ready") {
      pendingSaveIntent.current = false;
      setSaveOpen(true);
    }
  }, [geo.status]);

  // TEMP diagnostics for the installed-app bottom gap. Remove once fixed.
  const [debugText, setDebugText] = useState("");
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;left:0;bottom:0;width:1px;height:1px;visibility:hidden;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)";
    document.body.appendChild(probe);
    const measure = () => {
      const cs = getComputedStyle(probe);
      const vv = window.visualViewport;
      const app = document.getElementById("app")?.getBoundingClientRect();
      const nav = document.querySelector(".bottom-nav")?.getBoundingClientRect();
      const r = (n) => (n == null ? "-" : Math.round(n));
      setDebugText(
        [
          `inner ${r(window.innerWidth)}x${r(window.innerHeight)}`,
          `screen ${r(screen.width)}x${r(screen.height)}`,
          `vv ${r(vv?.width)}x${r(vv?.height)} top ${r(vv?.offsetTop)}`,
          `clientH ${r(document.documentElement.clientHeight)}`,
          `safe t ${cs.paddingTop} b ${cs.paddingBottom}`,
          `fixed-bottom probe ${r(probe.getBoundingClientRect().bottom)}`,
          `app ${r(app?.top)}-${r(app?.bottom)} nav ${r(nav?.top)}-${r(nav?.bottom)}`,
          `standalone ${String(window.navigator.standalone)}`,
        ].join("\n")
      );
    };
    measure();
    const id = setInterval(measure, 1000);
    return () => {
      clearInterval(id);
      probe.remove();
    };
  }, []);

  // Service worker registration.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    };
    // This effect runs after hydration, so "load" has often already fired.
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  // PWA install prompt.
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      if (!isInstallDismissed()) setInstallBannerVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const persistLocations = useCallback((next) => {
    setLocations(next);
    saveLocations(next);
  }, []);

  const persistPrefs = useCallback((next) => {
    setPrefs(next);
    savePrefs(next);
  }, []);

  const addLocation = useCallback(
    (entry) => {
      const next = [{ ...entry, id: uid(), createdAt: new Date().toISOString() }, ...locations];
      persistLocations(next);
      showToast("Location saved");
    },
    [locations, persistLocations, showToast]
  );

  const updateLocation = useCallback(
    (id, patch) => {
      const next = locations.map((l) => (l.id === id ? { ...l, ...patch } : l));
      persistLocations(next);
      showToast("Changes saved");
    },
    [locations, persistLocations, showToast]
  );

  const deleteLocation = useCallback(
    (id) => {
      const next = locations.filter((l) => l.id !== id);
      persistLocations(next);
      showToast("Location deleted");
    },
    [locations, persistLocations, showToast]
  );

  const clearAllLocations = useCallback(() => {
    persistLocations([]);
    showToast("All locations cleared");
  }, [persistLocations, showToast]);

  const locationsWithDistance = useMemo(() => {
    return locations.map((loc) => ({
      ...loc,
      distanceMiles: geo.position ? haversineMiles(geo.position.lat, geo.position.lng, loc.lat, loc.lng) : null,
    }));
  }, [locations, geo.position]);

  const detailLocation = useMemo(() => locationsWithDistance.find((l) => l.id === detailId) || null, [locationsWithDistance, detailId]);
  const deleteTargetLocation = useMemo(() => locations.find((l) => l.id === deleteTargetId) || null, [locations, deleteTargetId]);

  const handleInstall = useCallback(async () => {
    setInstallBannerVisible(false);
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
  }, [deferredInstallPrompt]);

  const handleDismissInstall = useCallback(() => {
    setInstallBannerVisible(false);
    setInstallDismissed();
  }, []);

  const openSaveSheet = useCallback(() => {
    if (!geo.position) {
      pendingSaveIntent.current = true;
      showToast("Waiting for your location…");
      return;
    }
    setSaveOpen(true);
  }, [geo.position, showToast]);

  return (
    <div id="app">
      <pre style={{ position: "fixed", top: "58%", left: 8, right: 8, zIndex: 9999, margin: 0, padding: 6, font: "11px/1.35 monospace", background: "rgba(255,255,0,0.85)", color: "#000", pointerEvents: "none", whiteSpace: "pre-wrap" }}>{debugText}</pre>
      <section className={`view view-home${view === "home" ? " active" : ""}`} aria-label="Home">
        <HomeView
          geo={geo}
          pins={locationsWithDistance}
          onPinClick={(id) => setDetailId(id)}
          onSave={openSaveSheet}
          onRecenter={() => setRecenterToken((t) => t + 1)}
          recenterToken={recenterToken}
        />
      </section>

      <section className={`view view-saved${view === "saved" ? " active" : ""}`} aria-label="Saved locations">
        <SavedView
          locations={locationsWithDistance}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortMode={prefs.sortMode}
          onSortModeChange={(sortMode) => persistPrefs({ ...prefs, sortMode })}
          hasPosition={!!geo.position}
          onOpenDetail={(id) => setDetailId(id)}
          onQuickDirections={(loc) => {
            window.open(buildDirectionsUrl(loc, prefs.navApp), "_blank", "noopener");
          }}
          onSaveCurrent={openSaveSheet}
        />
      </section>

      <section className={`view view-settings${view === "settings" ? " active" : ""}`} aria-label="Settings">
        <SettingsView
          permissionState={geo.permissionState}
          locationCount={locations.length}
          prefs={prefs}
          onPrefsChange={(next) => {
            persistPrefs(next);
            showToast("Preference saved");
          }}
          onClearAll={() => setClearConfirmOpen(true)}
          allLocations={locations}
          onImport={(data) => {
            if (!data) {
              showToast("That file isn't a valid backup");
              return;
            }
            persistLocations(data.locations);
            if (data.prefs) persistPrefs({ ...prefs, ...data.prefs });
            showToast(`Imported ${data.locations.length} location${data.locations.length === 1 ? "" : "s"}`);
          }}
        />
      </section>

      <BottomNav view={view} onChange={setView} />

      <SaveSheet
        open={saveOpen}
        position={geo.position}
        address={geo.address}
        onClose={() => setSaveOpen(false)}
        onSave={(entry) => {
          addLocation(entry);
          setSaveOpen(false);
        }}
      />

      <DetailSheet
        location={detailLocation}
        navApp={prefs.navApp}
        onClose={() => setDetailId(null)}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteTargetId(detailId)}
        onShared={(msg) => showToast(msg)}
      />

      <EditSheet
        open={editOpen}
        location={detailLocation}
        onClose={() => setEditOpen(false)}
        onSave={(patch) => {
          updateLocation(detailId, patch);
          setEditOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteTargetId}
        title={deleteTargetLocation ? `Delete "${deleteTargetLocation.name}"?` : "Delete this location?"}
        body="This can't be undone."
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          deleteLocation(deleteTargetId);
          setDeleteTargetId(null);
          setDetailId(null);
        }}
      />

      <ConfirmDialog
        open={clearConfirmOpen}
        title="Clear all saved locations?"
        body="This will permanently delete all locations stored on this device. This can't be undone."
        confirmLabel="Clear All"
        onCancel={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          clearAllLocations();
          setClearConfirmOpen(false);
        }}
      />

      <Toast message={toastMessage} />

      <InstallBanner visible={installBannerVisible} onInstall={handleInstall} onDismiss={handleDismissInstall} />
    </div>
  );
}
