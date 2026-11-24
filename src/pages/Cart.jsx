import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/ProductImage";
import { inr } from "../constants";

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-muted">Your cart is empty</p>
        <Link to="/" className="btn btn-primary mt-5">Browse products</Link>
      </div>
    );
  }

  const blocked = user && user.role !== "buyer";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Your cart</h1>
          <button className="text-sm text-red-400" onClick={clear}>Clear all</button>
        </div>
        {items.map((i) => (
          <div key={i.productId} className="card flex gap-4 p-3">
            <Link to={`/product/${i.productId}`}>
              <ProductImage src={i.image} className="h-24 w-24 rounded-lg" />
            </Link>
            <div className="flex-1">
              <Link to={`/product/${i.productId}`} className="font-semibold hover:text-accent">{i.name}</Link>
              <p className="text-xs text-muted">by {i.farmerName}</p>
              <p className="mt-1 text-sm">{inr(i.price)} / {i.unit}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-line text-sm">
                  <button className="px-2.5 py-1" onClick={() => setQty(i.productId, i.quantity - 1)}>−</button>
                  <span className="w-8 text-center">{i.quantity}</span>
                  <button className="px-2.5 py-1" onClick={() => setQty(i.productId, i.quantity + 1)}>+</button>
                </div>
                <button className="text-xs text-red-400" onClick={() => remove(i.productId)}>Remove</button>
              </div>
            </div>
            <p className="font-bold">{inr(i.price * i.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="card h-fit p-5">
        <h2 className="mb-4 font-bold">Order summary</h2>
        <div className="flex justify-between text-sm text-muted"><span>Items</span><span>{items.length}</span></div>
        <div className="mt-2 flex justify-between text-lg font-bold">
          <span>Total</span><span className="text-accent">{inr(total)}</span>
        </div>
        {blocked ? (
          <p className="mt-4 text-sm text-red-400">Only buyer accounts can place orders.</p>
        ) : (
          <button className="btn btn-primary mt-5 w-full" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </button>
        )}
      </div>
    </div>
  );
}
