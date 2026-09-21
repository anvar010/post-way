"use client";

import dynamic from "next/dynamic";
import { fmtCoord, formatSavedDate, formatDistance } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { buildDirectionsUrl, shareLocation } from "@/lib/directions";
import CategoryIcon from "./CategoryIcon";

const PreviewMap = dynamic(() => import("./PreviewMap"), { ssr: false });

export default function DetailSheet({ location, navApp, onClose, onEdit, onDelete, onShared }) {
  if (!location) return null;
  const cat = getCategory(location.category);
  const dist = formatDistance(location.distanceMiles);

  const handleShare = async () => {
    const result = await shareLocation(location);
    if (result.cancelled) return;
    onShared(result.ok ? (result.method === "clipboard" ? "Link copied to clipboard" : "Shared") : "Couldn't share this location");
  };

  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="detail-sheet-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <h2 id="detail-sheet-title">{location.name}</h2>
          <div className="sheet-header-actions">
            <button className="icon-btn" type="button" aria-label="Share location" onClick={handleShare}>
              <svg viewBox="0 0 24 24" width="17" height="17">
                <path
                  d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .05 2.24l-6.02 3.5a3 3 0 1 0 0 4.52l6.02 3.5A3 3 0 1 0 15.9 16l-6.02-3.5a3 3 0 0 0 0-1l6.02-3.5A3 3 0 0 0 18 8z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="icon-btn" type="button" aria-label="Edit location" onClick={onEdit}>
              <svg viewBox="0 0 24 24" width="19" height="19">
                <path
                  d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0 0-3L18 6a2.1 2.1 0 0 0-3 0L4.5 16.5V20zM14.5 8l1.5 1.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="sheet-scroll">
          {location.photo && (
            <div className="detail-photo">
              <img src={location.photo} alt="" />
            </div>
          )}

          <PreviewMap lat={location.lat} lng={location.lng} color={cat.color} className="map-preview map-preview--lg" />

          <div className="detail-block">
            <span className="category-badge" style={{ background: cat.soft, color: cat.color }}>
              <CategoryIcon category={cat} size={13} />
              {cat.label}
            </span>
            <h3 className="detail-name">{location.name}</h3>
            <p className="detail-desc" style={{ opacity: location.description ? 1 : 0.6 }}>
              {location.description || "No description added."}
            </p>
          </div>

          <div className="detail-row">
            <svg viewBox="0 0 24 24" width="18" height="18" className="detail-row-icon">
              <path
                d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                fill="currentColor"
              />
            </svg>
            <span>
              {location.address}
              {dist && ` · ${dist}`}
            </span>
          </div>

          <div className="coord-stamp coord-stamp--block">
            <span className="coord-field">
              <span className="coord-label">Lat</span>
              <span className="coord-value">{fmtCoord(location.lat)}</span>
            </span>
            <span className="coord-divider"></span>
            <span className="coord-field">
              <span className="coord-label">Lng</span>
              <span className="coord-value">{fmtCoord(location.lng)}</span>
            </span>
          </div>

          {location.reminderAt && (
            <div className="detail-row detail-row--muted">
              <svg viewBox="0 0 24 24" width="16" height="16" className="detail-row-icon">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.3l4.3 2.6-.8 1.3-5-3V7h1.5z" fill="currentColor" />
              </svg>
              <span>Reminder {new Date(location.reminderAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            </div>
          )}

          <div className="detail-row detail-row--muted">
            <svg viewBox="0 0 24 24" width="16" height="16" className="detail-row-icon">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.5 5v5.3l4.3 2.6-.8 1.3-5-3V7h1.5z" fill="currentColor" />
            </svg>
            <span>{formatSavedDate(location.createdAt)}</span>
          </div>
        </div>

        <div className="sheet-footer sheet-footer--stack">
          <button
            className="btn btn--accent btn--full"
            type="button"
            onClick={() => window.open(buildDirectionsUrl(location, navApp), "_blank", "noopener")}
          >
            <svg viewBox="0 0 24 24" width="19" height="19">
              <path d="M21 12 3 4l3.5 8L3 20l18-8z" fill="currentColor" />
            </svg>
            Get Directions
          </button>
          <div className="btn-row">
            <button className="btn btn--outline btn--half" type="button" onClick={onDelete}>
              Delete
            </button>
            <button className="btn btn--pine-soft btn--half" type="button" onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
