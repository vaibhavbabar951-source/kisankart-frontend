import { useEffect, useState } from "react";
import api, { errMsg } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { payForOrder } from "../utils/razorpay";
import StatusBadge from "../components/StatusBadge";
import ProductImage from "../components/ProductImage";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { fmtDate, inr } from "../constants";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/orders/my")
      .then((r) => setOrders(r.data.orders))
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const pay = async (id) => {
    try {
      await payForOrder(id, user);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (!orders) return error ? <Alert>{error}</Alert> : <Spinner />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">My orders</h1>
      <Alert>{error}</Alert>
      {orders.length === 0 && <p className="py-16 text-center text-muted">You have no orders yet.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="text-xs text-muted">Order #{o._id.slice(-8).toUpperCase()} · {fmtDate(o.createdAt)}</p>
                <p className="text-sm text-muted">
                  {o.paymentMethod === "cod" ? "Cash on Delivery" : "Online payment"}
                </p>
              </div>
              <div className="flex gap-2">
                <StatusBadge value={o.status} />
                <StatusBadge value={o.paymentStatus} />
              </div>
            </div>

            <div className="divide-y divide-line">
              {o.items.map((i) => (
                <div key={i.product} className="flex items-center gap-3 py-2">
                  <ProductImage src={i.image} className="h-12 w-12 rounded" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-xs text-muted">{i.quantity} {i.unit} × {inr(i.price)}</p>
                  </div>
                  <p className="text-sm font-semibold">{inr(i.price * i.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">Total: <span className="text-accent">{inr(o.totalAmount)}</span></p>
              <div className="flex gap-2">
                {o.paymentMethod === "online" &&
                  ["pending", "failed"].includes(o.paymentStatus) &&
                  o.status !== "cancelled" && (
                    <button className="btn btn-primary btn-sm" onClick={() => pay(o._id)}>Pay now</button>
                  )}
                {["pending", "confirmed"].includes(o.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => cancel(o._id)}>Cancel order</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
