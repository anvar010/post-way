"use client";

import { useEffect, useRef } from "react";

const CHECK_INTERVAL_MS = 20000;

// Fires while the app is open and a saved location's reminder time has
// passed. This is intentionally local-only (no push backend), so it only
// triggers while this tab is open — it won't wake a closed browser.
export function useReminders(locations, onDue) {
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      for (const loc of locations) {
        if (!loc.reminderAt) continue;
        const dueTime = new Date(loc.reminderAt).getTime();
        if (Number.isNaN(dueTime) || dueTime > now) continue;
        if (notifiedRef.current.has(loc.id)) continue;
        notifiedRef.current.add(loc.id);
        onDue(loc);
      }
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [locations, onDue]);
}
