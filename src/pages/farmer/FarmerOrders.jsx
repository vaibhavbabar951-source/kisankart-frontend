import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import { fmtDate, inr } from "../../constants";

// next actions a farmer can take
const ACTIONS = {
  pending: [["confirmed", "Confirm", "btn-primary"], ["cancelled", "Reject", "btn-danger"]],
  confirmed: [["shipped", "Mark shipped", "btn-primary"], ["cancelled", "Cancel", "btn-danger"]],
  shipped: [["delivered", "Mark delivered", "btn-primary"]],
};

export default function FarmerOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/orders/farmer")
      .then((r) => setOrders(r.data.orders))
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    setError("");
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (!orders) return error ? <Alert>{error}</Alert> : <Spinner />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">Orders received</h1>
      <Alert>{error}</Alert>
      {orders.length === 0 && <p className="py-16 text-center text-muted">No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <p className="text-xs text-muted">Order #{o._id.slice(-8).toUpperCase()} · {fmtDate(o.createdAt)}</p>
              <div className="flex gap-2">
                <StatusBadge value={o.status} />
                <StatusBadge value={o.paymentStatus} />
              </div>
            </div>

            <div className="grid gap-4 py-3 md:grid-cols-2">
              <div className="text-sm">
                <p className="mb-1 font-semibold">Deliver to</p>
                <p>{o.shippingAddress.fullName} · {o.shippingAddress.phone}</p>
                <p className="text-muted">
                  {o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {o.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}
                </p>
              </div>
              <div className="text-sm">
                <p className="mb-1 font-semibold">Your items</p>
                {o.items.map((i) => (
                  <div key={i.product} className="flex justify-between">
                    <span>{i.name} × {i.quantity} {i.unit}</span>
                    <span>{inr(i.price * i.quantity)}</span>
                  </div>
                ))}
                <p className="mt-2 border-t border-line pt-2 font-bold">
                  Your total: <span className="text-accent">{inr(o.farmerTotal)}</span>
                </p>
              </div>
            </div>

            {ACTIONS[o.status] && (
              <div className="flex gap-2">
                {ACTIONS[o.status].map(([status, label, cls]) => (
                  <button key={status} className={`btn btn-sm ${cls}`} onClick={() => setStatus(o._id, status)}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
