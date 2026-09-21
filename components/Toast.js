"use client";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <svg viewBox="0 0 24 24" width="16" height="16" className="toast-icon">
        <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
