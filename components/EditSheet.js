"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { compressImageFile } from "@/lib/image";
import { getCategory } from "@/lib/categories";
import CategoryPicker from "./CategoryPicker";
import MembersField from "./MembersField";

const PreviewMap = dynamic(() => import("./PreviewMap"), { ssr: false });

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditSheet({ open, location, onClose, onSave }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([""]);
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [photo, setPhoto] = useState(null);
  const [reminderAt, setReminderAt] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    if (open && location) {
      setName(location.name);
      setMembers(location.members?.length ? location.members : [""]);
      setMobile(location.mobile || "");
      setDescription(location.description || "");
      setCategory(location.category || "general");
      setPhoto(location.photo || null);
      setReminderAt(toLocalInputValue(location.reminderAt));
    }
  }, [open, location]);

  if (!open || !location) return null;

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    try {
      setPhoto(await compressImageFile(file));
    } catch {
      // ignore
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      members: members.map((m) => m.trim()).filter(Boolean),
      mobile: mobile.trim(),
      description: description.trim(),
      category,
      photo,
      reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
    });
  };

  const cat = getCategory(category);

  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="edit-sheet-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <h2 id="edit-sheet-title">Edit Location</h2>
          <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="sheet-scroll">
          <PreviewMap lat={location.lat} lng={location.lng} color={cat.color} className="map-preview" />
          <form id="edit-form" className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">
                House name <span className="req">*</span>
              </span>
              <input type="text" maxLength={60} required value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <div className="field">
              <span className="field-label">
                Members <span className="opt">optional</span>
              </span>
              <MembersField members={members} onChange={setMembers} />
            </div>

            <label className="field">
              <span className="field-label">
                Mobile number <span className="opt">optional</span>
              </span>
              <input type="tel" placeholder="e.g. +1 555 123 4567" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </label>

            <div className="field">
              <span className="field-label">Category</span>
              <CategoryPicker value={category} onChange={setCategory} />
            </div>

            <label className="field">
              <span className="field-label">
                Description <span className="opt">optional</span>
              </span>
              <textarea maxLength={200} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
              <input type="datetime-local" value={reminderAt} onChange={(e) => setReminderAt(e.target.value)} />
            </label>
          </form>
        </div>
        <div className="sheet-footer">
          <button className="btn btn--primary btn--full" type="submit" form="edit-form">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
