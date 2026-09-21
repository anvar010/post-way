"use client";

export default function InstallBanner({ visible, onInstall, onDismiss }) {
  if (!visible) return null;
  return (
    <div className="install-banner">
      <div className="install-banner-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="install-banner-text">
        <p className="install-banner-title">Install Post-Way</p>
        <p className="install-banner-sub">Add it to your home screen for one-tap access</p>
      </div>
      <button className="btn btn--pine btn--sm" type="button" onClick={onInstall}>
        Install
      </button>
      <button className="icon-btn" type="button" aria-label="Dismiss" onClick={onDismiss}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
