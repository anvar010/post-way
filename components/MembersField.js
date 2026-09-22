"use client";

import { useRef } from "react";

export default function MembersField({ members, onChange }) {
  const inputRefs = useRef([]);

  const updateName = (index, value) => {
    const next = [...members];
    next[index] = value;
    onChange(next);
  };

  const addMember = () => {
    const nextIndex = members.length;
    onChange([...members, ""]);
    setTimeout(() => inputRefs.current[nextIndex]?.focus(), 50);
  };

  return (
    <div className="members-field">
      {members.map((name, i) => (
        <div className="member-row" key={i}>
          <input
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength={60}
            placeholder="Member name"
            value={name}
            onChange={(e) => updateName(i, e.target.value)}
          />
          {i === members.length - 1 && (
            <button type="button" className="member-add-btn" aria-label="Add another member" onClick={addMember}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
