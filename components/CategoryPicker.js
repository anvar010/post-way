"use client";

import { CATEGORIES } from "@/lib/categories";
import CategoryIcon from "./CategoryIcon";

export default function CategoryPicker({ value, onChange }) {
  return (
    <div className="category-picker" role="radiogroup" aria-label="Category">
      {CATEGORIES.map((cat) => {
        const active = cat.id === value;
        return (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`category-chip${active ? " active" : ""}`}
            style={active ? { background: cat.color, borderColor: cat.color, color: "#fff" } : { color: cat.color, borderColor: cat.soft }}
            onClick={() => onChange(cat.id)}
          >
            <CategoryIcon category={cat} size={15} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
