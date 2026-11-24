import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../api/axios";
import ProductImage from "../components/ProductImage";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { cap, inr } from "../constants";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setP(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [id]);

  if (error) return <Alert>{error}</Alert>;
  if (!p) return <Spinner />;

  const canBuy = (!user || user.role === "buyer") && p.isAvailable && p.quantity > 0;

  const addToCart = () => {
    add(p, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card overflow-hidden">
        <ProductImage src={p.image} alt={p.name} className="aspect-square w-full" />
      </div>

      <div>
        <span className="chip chip-active">{cap(p.category)}</span>
        <h1 className="mt-3 text-3xl font-extrabold">{p.name}</h1>
        <p className="mt-3 text-3xl font-bold text-accent">
          {inr(p.price)} <span className="text-base font-normal text-muted">/ {p.unit}</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          {p.isAvailable && p.quantity > 0 ? `${p.quantity} ${p.unit} in stock` : "Out of stock"}
        </p>

        {p.description && <p className="mt-4 text-sm leading-relaxed text-zinc-300">{p.description}</p>}

        {canBuy && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-line">
              <button className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty(Math.min(p.quantity, qty + 1))}>+</button>
            </div>
            <button className="btn btn-primary" onClick={addToCart}>
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                add(p, qty);
                navigate("/checkout");
              }}
            >
              Buy now
            </button>
          </div>
        )}

        <div className="card mt-8 flex items-center gap-3 p-4">
          <Avatar user={p.farmer} size={48} />
          <div>
            <p className="text-xs text-muted">Sold by</p>
            <p className="font-semibold">{p.farmer?.name}</p>
            <p className="text-xs text-muted">
              {[p.farmer?.address?.city, p.farmer?.address?.state].filter(Boolean).join(", ")}
              {p.farmer?.phone ? ` · ${p.farmer.phone}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
