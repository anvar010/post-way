"use client";

import { useRef } from "react";

const PERMISSION_COPY = {
  granted: { text: "Post-Way can access your location", pill: "Allowed" },
  denied: { text: "Blocked — enable it in browser settings", pill: "Blocked" },
  prompt: { text: "Post-Way hasn't asked yet", pill: "Not set" },
  unknown: { text: "Checking…", pill: "—" },
};

export default function SettingsView({ permissionState, locationCount, prefs, onPrefsChange, onClearAll, allLocations, onImport }) {
  const importInputRef = useRef(null);
  const copy = PERMISSION_COPY[permissionState] || PERMISSION_COPY.unknown;

  const handleExport = () => {
    const payload = { exportedAt: new Date().toISOString(), locations: allLocations, prefs };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `postway-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data.locations)) throw new Error("Invalid backup file");
      onImport(data);
    } catch {
      onImport(null);
    }
  };

  return (
    <>
      <header className="topbar">
        <h1>Settings</h1>
      </header>

      <div className="settings-scroll">
        <div className="settings-section">
          <p className="settings-heading">Location</p>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-icon" data-state={permissionState}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="settings-row-text">
                <p className="settings-row-title">Permission status</p>
                <p className="settings-row-sub">{copy.text}</p>
              </div>
              <span className="status-pill" data-state={permissionState}>
                {copy.pill}
              </span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <p className="settings-heading">Map &amp; navigation</p>
          <div className="settings-card">
            <div className="settings-row settings-row--select">
              <div className="settings-row-text">
                <p className="settings-row-title">Directions app</p>
                <p className="settings-row-sub">Used when you tap &quot;Get Directions&quot;</p>
              </div>
              <select
                className="select-field"
                value={prefs.navApp}
                onChange={(e) => onPrefsChange({ ...prefs, navApp: e.target.value })}
              >
                <option value="google">Google Maps</option>
                <option value="apple">Apple Maps</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <p className="settings-heading">Data</p>
          <div className="settings-card">
            <button className="settings-row settings-row--action" type="button" onClick={handleExport}>
              <div className="settings-row-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              </div>
              <div className="settings-row-text">
                <p className="settings-row-title">Export backup</p>
                <p className="settings-row-sub">Download all saved locations as a file</p>
              </div>
            </button>
            <div className="settings-divider" />
            <button className="settings-row settings-row--action" type="button" onClick={() => importInputRef.current?.click()}>
              <div className="settings-row-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3m0 0 4 4m-4-4-4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              </div>
              <div className="settings-row-text">
                <p className="settings-row-title">Import backup</p>
                <p className="settings-row-sub">Restore locations from a backup file</p>
              </div>
            </button>
            <input ref={importInputRef} type="file" accept="application/json" hidden onChange={handleImportFile} />
            <div className="settings-divider" />
            <button className="settings-row settings-row--action" type="button" onClick={onClearAll}>
              <div className="settings-row-icon settings-row-icon--danger">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2H8l1-2zM4 7h16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div className="settings-row-text">
                <p className="settings-row-title settings-row-title--danger">Clear all saved locations</p>
                <p className="settings-row-sub">
                  {locationCount} location{locationCount === 1 ? "" : "s"} stored on this device
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <p className="settings-heading">About</p>
          <div className="settings-card settings-card--about">
            <div className="about-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <p className="settings-row-title">Post-Way</p>
              <p className="settings-row-sub">Version 1.0.0 · Locations are stored only on this device</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
