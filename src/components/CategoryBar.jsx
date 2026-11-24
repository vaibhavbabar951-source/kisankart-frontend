import { CATEGORIES, cap } from "../constants";

export default function CategoryBar({ active, onChange }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3">
      <button className={`chip ${!active ? "chip-active" : ""}`} onClick={() => onChange("")}>
        All
      </button>
      {CATEGORIES.map((c) => (
        <button key={c} className={`chip ${active === c ? "chip-active" : ""}`} onClick={() => onChange(c)}>
          {cap(c)}
        </button>
      ))}
    </div>
  );
}
