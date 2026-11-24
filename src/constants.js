export const CATEGORIES = ["vegetables", "fruits", "grains", "pulses", "dairy", "other"];
export const UNITS = ["kg", "quintal", "dozen", "litre", "piece"];
export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
