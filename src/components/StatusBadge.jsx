const COLORS = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  shipped: "bg-purple-500/15 text-purple-400",
  delivered: "bg-green-500/15 text-green-400",
  paid: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
  failed: "bg-red-500/15 text-red-400",
  refund_pending: "bg-orange-500/15 text-orange-400",
  refunded: "bg-zinc-500/20 text-zinc-300",
  created: "bg-zinc-500/20 text-zinc-300",
};

export default function StatusBadge({ value }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
        COLORS[value] || "bg-zinc-500/20 text-zinc-300"
      }`}
    >
      {String(value).replace("_", " ")}
    </span>
  );
}
