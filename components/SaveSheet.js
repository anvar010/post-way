"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { fmtCoord } from "@/lib/format";
import { compressImageFile } from "@/lib/image";
import { getCategory } from "@/lib/categories";
import CategoryPicker from "./CategoryPicker";

const PreviewMap = dynamic(() => import("./PreviewMap"), { ssr: false });

function maybeRequestNotificationPermission() {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

export default function SaveSheet({ open, position, address, onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [photo, setPhoto] = useState(null);
  const [reminderAt, setReminderAt] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setCategory("general");
      setPhoto(null);
      setReminderAt("");
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    try {
      const dataUrl = await compressImageFile(file);
      setPhoto(dataUrl);
    } catch {
      // ignore — photo stays unset
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !position) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      photo,
      reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
      lat: position.lat,
      lng: position.lng,
      address: address || `${fmtCoord(position.lat)}, ${fmtCoord(position.lng)}`,
    });
  };

  const cat = getCategory(category);

  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="save-sheet-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <h2 id="save-sheet-title">Save Location</h2>
          <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="sheet-scroll">
          <PreviewMap lat={position?.lat} lng={position?.lng} color={cat.color} className="map-preview" />
          <div className="coord-stamp coord-stamp--block">
            <span className="coord-field">
              <span className="coord-label">Lat</span>
              <span className="coord-value">{fmtCoord(position?.lat)}</span>
            </span>
            <span className="coord-divider"></span>
            <span className="coord-field">
              <span className="coord-label">Lng</span>
              <span className="coord-value">{fmtCoord(position?.lng)}</span>
            </span>
          </div>
          <p className="field-address">{address || "Locating address…"}</p>

          <form id="save-form" className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">
                Location name <span className="req">*</span>
              </span>
              <input
                ref={nameInputRef}
                type="text"
                maxLength={60}
                placeholder="e.g. Downtown Parking Garage"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <div className="field">
              <span className="field-label">Category</span>
              <CategoryPicker value={category} onChange={setCategory} />
            </div>

            <label className="field">
              <span className="field-label">
                Description <span className="opt">optional</span>
              </span>
              <textarea
                maxLength={200}
                rows={3}
                placeholder="Add a note to help you remember this place…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <div className="field">
              <span className="field-label">
                Photo <span className="opt">optional</span>
              </span>
              {photo ? (
                <div className="photo-preview">
                  <img src={photo} alt="" />
                  <button type="button" className="photo-remove" onClick={() => setPhoto(null)} aria-label="Remove photo">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="photo-upload">
                  <input type="file" accept="image/*" capture="environment" hidden onChange={handlePhotoChange} />
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 6a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"
                      fill="currentColor"
                    />
                  </svg>
                  {photoBusy ? "Processing…" : "Add a photo"}
                </label>
              )}
            </div>

            <label className="field">
              <span className="field-label">
                Reminder <span className="opt">optional</span>
              </span>
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => {
                  setReminderAt(e.target.value);
                  if (e.target.value) maybeRequestNotificationPermission();
                }}
              />
            </label>
          </form>
        </div>

        <div className="sheet-footer">
          <button className="btn btn--primary btn--full" type="submit" form="save-form" disabled={!name.trim()}>
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}
