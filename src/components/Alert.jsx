export default function Alert({ type = "error", children }) {
  if (!children) return null;
  const color =
    type === "error"
      ? "border-red-900 bg-red-950/50 text-red-300"
      : "border-green-900 bg-green-950/50 text-green-300";
  return <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${color}`}>{children}</div>;
}
