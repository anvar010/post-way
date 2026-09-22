"use client";

import { useLayoutEffect, useRef, useState } from "react";

const TABS = [
  { id: "home", label: "Home" },
  { id: "saved", label: "Saved" },
  { id: "settings", label: "Settings" },
];

function TabIcon({ id }) {
  if (id === "home") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
          fill="currentColor"
        />
        <path
          d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (id === "saved") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.083.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.088-.277-.228-.297-.349l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function BottomNav({ view, onChange }) {
  const navRef = useRef(null);
  const iconRefs = useRef([]);
  const [indicator, setIndicator] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const activeIndex = TABS.findIndex((t) => t.id === view);
      const iconEl = iconRefs.current[activeIndex];
      const navEl = navRef.current;
      if (!iconEl || !navEl) return;
      const navRect = navEl.getBoundingClientRect();
      const iconRect = iconEl.getBoundingClientRect();
      setIndicator((prev) => ({
        top: iconRect.top - navRect.top - navEl.clientTop,
        left: iconRect.left - navRect.left - navEl.clientLeft,
        size: iconRect.width,
        instant: prev === null,
      }));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [view]);

  return (
    <nav className="bottom-nav" aria-label="Primary" ref={navRef}>
      {indicator && (
        <span
          className={`nav-indicator${indicator.instant ? " nav-indicator--instant" : ""}`}
          style={{
            width: indicator.size,
            height: indicator.size,
            top: indicator.top,
            left: 0,
            transform: `translateX(${indicator.left}px)`,
          }}
          aria-hidden="true"
        />
      )}
      {TABS.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => (iconRefs.current[i] = el && el.querySelector(".nav-item-icon"))}
          type="button"
          className={`nav-item${view === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-item-icon">
            <TabIcon id={tab.id} />
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
