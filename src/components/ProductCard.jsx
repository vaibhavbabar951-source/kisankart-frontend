import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { inr } from "../constants";

export default function ProductCard({ p }) {
  const { user } = useAuth();
  const { add } = useCart();
  const canBuy = !user || user.role === "buyer";

  return (
    <div className="group card overflow-hidden transition hover:border-accent">
      <Link to={`/product/${p._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface2">
          <ProductImage
            src={p.image}
            alt={p.name}
            className="h-full w-full transition duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-xs font-bold">
            {inr(p.price)}/{p.unit}
          </span>
          {p.quantity <= 5 && (
            <span className="absolute right-2 top-2 rounded bg-accent px-2 py-1 text-xs font-bold">
              Only {p.quantity} left
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-semibold group-hover:text-accent">{p.name}</h3>
          <p className="mt-1 truncate text-xs text-muted">
            by {p.farmer?.name || "Farmer"}
            {p.farmer?.address?.city ? ` · ${p.farmer.address.city}` : ""}
          </p>
        </div>
      </Link>
      {canBuy && (
        <div className="px-3 pb-3">
          <button className="btn btn-primary w-full" onClick={() => add(p, 1)}>
            Add to cart
          </button>
        </div>
      )}
    </div>
  );
}
