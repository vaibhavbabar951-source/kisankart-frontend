import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { payForOrder } from "../utils/razorpay";
import Alert from "../components/Alert";
import { inr } from "../constants";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [addr, setAddr] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address?.village || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });
  const [method, setMethod] = useState("cod");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setAddr({ ...addr, [k]: e.target.value });

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary mt-4">Browse products</Link>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: addr,
        paymentMethod: method,
      });
      clear();

      if (method === "online") {
        try {
          await payForOrder(data.order._id, user);
        } catch (err) {
          // order is saved; the buyer can retry from My Orders
          alert(errMsg(err) + "\nYou can retry payment from My Orders.");
        }
      }
      navigate("/orders");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card p-5">
          <h2 className="mb-4 text-lg font-bold">Shipping address</h2>
          <Alert>{error}</Alert>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["address", "Address (house, street, village)"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ].map(([k, label]) => (
              <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
                <label className="label">{label}</label>
                <input className="input" required value={addr[k]} onChange={set(k)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-lg font-bold">Payment method</h2>
          {[
            ["cod", "Cash on Delivery", "Pay when your order arrives"],
            ["online", "Pay online", "UPI, cards, netbanking via Razorpay"],
          ].map(([v, title, sub]) => (
            <label
              key={v}
              className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                method === v ? "border-accent bg-surface2" : "border-line"
              }`}
            >
              <input type="radio" name="pay" checked={method === v} onChange={() => setMethod(v)} />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted">{sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card h-fit p-5">
        <h2 className="mb-3 font-bold">Order summary</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between py-1 text-sm">
            <span className="truncate pr-2">{i.name} × {i.quantity}</span>
            <span>{inr(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-lg font-bold">
          <span>Total</span><span className="text-accent">{inr(total)}</span>
        </div>
        <button className="btn btn-primary mt-5 w-full" disabled={busy}>
          {busy ? "Placing order..." : method === "online" ? "Place order & pay" : "Place order"}
        </button>
      </div>
    </form>
  );
}
