"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { fmtCoord, relativeUpdated } from "@/lib/format";
import { getCategory } from "@/lib/categories";

const HomeMap = dynamic(() => import("./HomeMap"), { ssr: false });

export default function HomeView({ geo, pins, onPinClick, onSave, onRecenter, recenterToken, onPickSpot }) {
  const [picking, setPicking] = useState(false);
  const [pickToken, setPickToken] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const mapPins = pins.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, color: getCategory(p.category).color, name: p.name }));
  const status = geo.status;

  return (
    <>
      <header className="topbar topbar--home">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="brand-text">
            <h1>Post-Way</h1>
            <p>Find your way back</p>
          </div>
        </div>
        <div className="status-chip" data-state={status}>
          <span className="status-dot" aria-hidden="true"></span>
          <span>{{ loading: "Locating", ready: "Live", prompt: "Off", denied: "Blocked", error: "Error" }[status] || "—"}</span>
        </div>
      </header>

      <div className={`map-wrap${expanded ? " map-wrap--expanded" : ""}`}>
        <HomeMap
          position={geo.position}
          pins={mapPins}
          onPinClick={onPinClick}
          recenterToken={recenterToken}
          pickToken={pickToken}
          onPick={(spot) => {
            setPicking(false);
            onPickSpot(spot);
          }}
        />
        {picking && (
          <div className="map-pick-pin" aria-hidden="true">
            <svg viewBox="0 0 30 38" width="34" height="43">
              <path d="M15 0C7 0 1 6.2 1 13.8 1 24 15 38 15 38s14-14 14-24.2C29 6.2 23 0 15 0z" fill="#8E1F2B" />
              <circle cx="15" cy="14" r="5.5" fill="#fff" />
            </svg>
          </div>
        )}
        {status === "loading" && <div className="map-skeleton" />}
        <button
          className="map-fab map-fab--expand"
          type="button"
          aria-label={expanded ? "Exit full screen map" : "Expand map to full screen"}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>
        <button className="map-fab" type="button" aria-label="Recenter map on my location" onClick={onRecenter}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="7.2" />
            <path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5" />
          </svg>
        </button>
        {expanded && (
          <div className="map-expanded-actions">
            {picking ? (
              <>
                <div className="location-card pick-hint">
                  <div className="lc-copy">
                    <p className="lc-title">Move the map to place the pin</p>
                    <p className="lc-sub">Zoom in for an exact spot, then tap Use this spot.</p>
                  </div>
                </div>
                <div className="pick-actions">
                  <button className="btn btn--outline" type="button" onClick={() => setPicking(false)}>
                    Cancel
                  </button>
                  <button className="btn btn--primary btn--pick" type="button" onClick={() => setPickToken((t) => t + 1)}>
                    Use this spot
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className="btn btn--primary btn--save" type="button" disabled={status !== "ready"} onClick={onSave}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                      fill="currentColor"
                    />
                  </svg>
                  Save This Location
                </button>
                <button className="btn btn--outline btn--custom" type="button" onClick={() => setPicking(true)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="12" r="7.2" />
                    <path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5" />
                  </svg>
                  Pin a different spot
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {picking ? (
        <div className="sheet-fixed">
          <div className="location-card pick-hint">
            <div className="lc-copy">
              <p className="lc-title">Move the map to place the pin</p>
              <p className="lc-sub">Zoom in for an exact spot, then tap Use this spot.</p>
            </div>
          </div>
          <div className="pick-actions">
            <button className="btn btn--outline" type="button" onClick={() => setPicking(false)}>
              Cancel
            </button>
            <button className="btn btn--primary btn--pick" type="button" onClick={() => setPickToken((t) => t + 1)}>
              Use this spot
            </button>
          </div>
        </div>
      ) : (
      <div className="sheet-fixed">
        <div className="location-card" data-state={status}>
          {status === "loading" && (
            <div className="lc-state lc-loading">
              <div className="skel-line skel-line--wide" />
              <div className="skel-line skel-line--narrow" />
            </div>
          )}

          {status === "prompt" && (
            <div className="lc-state lc-prompt">
              <div className="lc-icon lc-icon--muted">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="lc-copy">
                <p className="lc-title">Turn on location</p>
                <p className="lc-sub">Post-Way needs your location to show it on the map and save it.</p>
              </div>
              <button className="btn btn--pine btn--sm" type="button" onClick={geo.request}>
                Allow Access
              </button>
            </div>
          )}

          {status === "denied" && (
            <div className="lc-state lc-denied">
              <div className="lc-icon lc-icon--warn">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M12 2 1 21h22L12 2zm0 6.5 6.1 10.6H5.9L12 8.5zM11 11v4h2v-4h-2zm0 5.5v2h2v-2h-2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="lc-copy">
                <p className="lc-title">Location access blocked</p>
                <p className="lc-sub">Enable location for this site in your browser settings, then try again.</p>
              </div>
              <button className="btn btn--outline btn--sm" type="button" onClick={geo.request}>
                Try Again
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="lc-state lc-error">
              <div className="lc-icon lc-icon--warn">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M12 2 1 21h22L12 2zm0 6.5 6.1 10.6H5.9L12 8.5zM11 11v4h2v-4h-2zm0 5.5v2h2v-2h-2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="lc-copy">
                <p className="lc-title">Couldn&apos;t find your location</p>
                <p className="lc-sub">{geo.errorDetail || "Check your connection or GPS signal and try again."}</p>
              </div>
              <button className="btn btn--outline btn--sm" type="button" onClick={geo.request}>
                Try Again
              </button>
            </div>
          )}

          {status === "ready" && (
            <div className="lc-state lc-ready">
              <div className="lc-row">
                <div className="lc-icon lc-icon--live" aria-hidden="true">
                  <span className="pulse-dot"></span>
                </div>
                <div className="lc-copy">
                  <p className="lc-title">{geo.address || "Locating address…"}</p>
                  <p className="lc-sub">{geo.updatedAt ? relativeUpdated(geo.updatedAt) : ""}</p>
                </div>
              </div>
              <div className="coord-stamp">
                <span className="coord-field">
                  <span className="coord-label">Lat</span>
                  <span className="coord-value">{fmtCoord(geo.position?.lat)}</span>
                </span>
                <span className="coord-divider"></span>
                <span className="coord-field">
                  <span className="coord-label">Lng</span>
                  <span className="coord-value">{fmtCoord(geo.position?.lng)}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn--primary btn--save" type="button" disabled={status !== "ready"} onClick={onSave}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
              fill="currentColor"
            />
          </svg>
          Save This Location
        </button>
        <button className="btn btn--outline btn--custom" type="button" onClick={() => setPicking(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="7.2" />
            <path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5" />
          </svg>
          Pin a different spot
        </button>
      </div>
      )}
    </>
  );
}
