"use client";

const TABS = [
  {
    id: "home",
    label: "Home",
    path: "M12 3 3 10.5V21h6v-6h6v6h6V10.5L12 3z",
  },
  {
    id: "saved",
    label: "Saved",
    path: "M6 2h9a2 2 0 0 1 2 2v18l-6.5-4L4 22V4a2 2 0 0 1 2-2z",
  },
  {
    id: "settings",
    label: "Settings",
    path: "M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L14.9 3h-4l-.4 2.9a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.4 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1l.4 2.9h4l.4-2.9a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5-2.1-1.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z",
  },
];

export default function BottomNav({ view, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-item${view === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-item-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d={tab.path} fill="currentColor" />
            </svg>
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
