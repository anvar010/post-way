"use client";

import { useMemo } from "react";
import { CATEGORIES, getCategory } from "@/lib/categories";
import CategoryIcon from "./CategoryIcon";
import { formatDistance } from "@/lib/format";

function matchesQuery(loc, q) {
  if (!q) return true;
  const hay = `${loc.name} ${loc.description || ""} ${loc.address}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default function SavedView({
  locations,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortMode,
  onSortModeChange,
  hasPosition,
  onOpenDetail,
  onQuickDirections,
  onDeleteRequest,
  onSaveCurrent,
}) {
  const filtered = useMemo(() => {
    let list = locations.filter((loc) => matchesQuery(loc, searchQuery));
    if (categoryFilter !== "all") list = list.filter((loc) => (loc.category || "general") === categoryFilter);
    if (sortMode === "nearest" && hasPosition) {
      list = [...list].sort((a, b) => (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [locations, searchQuery, categoryFilter, sortMode, hasPosition]);

  const total = locations.length;

  return (
    <>
      <header className="topbar">
        <div className="topbar-title-row">
          <h1>Saved</h1>
          <span className="count-badge">{total}</span>
        </div>
      </header>

      <div className="search-wrap">
        <div className="search-field">
          <svg viewBox="0 0 24 24" width="18" height="18" className="search-icon">
            <path
              d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
              fill="currentColor"
            />
          </svg>
          <input
            type="search"
            placeholder="Search saved locations"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {total > 0 && (
        <>
          <div className="filter-row">
            <button
              type="button"
              className={`filter-chip${categoryFilter === "all" ? " active" : ""}`}
              onClick={() => onCategoryFilterChange("all")}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-chip${categoryFilter === cat.id ? " active" : ""}`}
                style={categoryFilter === cat.id ? { background: cat.color, borderColor: cat.color, color: "#fff" } : { color: cat.color, borderColor: cat.soft }}
                onClick={() => onCategoryFilterChange(cat.id)}
              >
                <CategoryIcon category={cat} size={13} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="sort-row">
            <button
              type="button"
              className={`sort-toggle${sortMode !== "nearest" ? " active" : ""}`}
              onClick={() => onSortModeChange("recent")}
            >
              Recent
            </button>
            <button
              type="button"
              className={`sort-toggle${sortMode === "nearest" ? " active" : ""}`}
              disabled={!hasPosition}
              onClick={() => onSortModeChange("nearest")}
            >
              Nearest
            </button>
          </div>
        </>
      )}

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">
            <svg viewBox="0 0 120 120" width="96" height="96">
              <circle cx="60" cy="60" r="58" fill="#F5EBE0" />
              <path
                d="M60 30c-11 0-20 8.8-20 20 0 15 20 38 20 38s20-23 20-38c0-11.2-9-20-20-20z"
                fill="#8E1F2B"
              />
              <circle cx="60" cy="50" r="7" fill="#E2A73B" />
            </svg>
          </div>
          <h2>No saved locations yet</h2>
          <p>Save your current location to quickly find it again later.</p>
          <button className="btn btn--primary" type="button" onClick={onSaveCurrent}>
            Save Current Location
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">
            <svg viewBox="0 0 120 120" width="80" height="80">
              <circle cx="60" cy="60" r="58" fill="#F5EBE0" />
              <circle cx="52" cy="52" r="20" stroke="#8E1F2B" strokeWidth="6" fill="none" />
              <line x1="67" y1="67" x2="84" y2="84" stroke="#8E1F2B" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <h2>No matches</h2>
          <p>{searchQuery ? `Nothing matches "${searchQuery}".` : "No locations in this category."}</p>
        </div>
      ) : (
        <div className="saved-list">
          {filtered.map((loc) => {
            const cat = getCategory(loc.category);
            const dist = formatDistance(loc.distanceMiles);
            return (
              <button key={loc.id} type="button" className="loc-card" onClick={() => onOpenDetail(loc.id)}>
                {loc.photo ? (
                  <span className="loc-card-photo" style={{ backgroundImage: `url(${loc.photo})` }} aria-hidden="true" />
                ) : (
                  <span className="loc-card-icon" style={{ background: cat.soft, color: cat.color }} aria-hidden="true">
                    <CategoryIcon category={cat} size={20} />
                  </span>
                )}
                <span className="loc-card-body">
                  <span className="loc-card-name">{loc.name}</span>
                  {loc.description && <span className="loc-card-desc">{loc.description}</span>}
                  <span className="loc-card-addr">
                    <svg viewBox="0 0 24 24" width="11" height="11">
                      <path
                        d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                        fill="currentColor"
                      />
                    </svg>
                    {loc.address}
                    {dist && <span className="loc-card-distance"> · {dist}</span>}
                  </span>
                </span>
                <span className="loc-card-actions">
                  <span
                    className="loc-card-directions"
                    role="button"
                    tabIndex={0}
                    aria-label={`Get directions to ${loc.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickDirections(loc);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="17" height="17">
                      <path d="M21 12 3 4l3.5 8L3 20l18-8z" fill="currentColor" />
                    </svg>
                  </span>
                  <span
                    className="loc-card-delete"
                    role="button"
                    tabIndex={0}
                    aria-label={`Delete ${loc.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest(loc.id);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7h12z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
