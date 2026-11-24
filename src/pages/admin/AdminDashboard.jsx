import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import { fmtDate, inr } from "../../constants";

const TABS = ["Overview", "Users", "Orders", "Payments"];

function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => {
    api.get("/admin/stats").then((r) => setS(r.data));
  }, []);
  if (!s) return <Spinner />;

  const cards = [
    ["Farmers", s.farmers],
    ["Buyers", s.buyers],
    ["Products", s.products],
    ["Orders", s.orders],
    ["Revenue (paid)", inr(s.revenue)],
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-accent">{value}</p>
          </div>
        ))}
      </div>
      <h3 className="mb-2 mt-6 font-bold">Orders by status</h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(s.ordersByStatus).map(([k, v]) => (
          <div key={k} className="card flex items-center gap-2 px-3 py-2">
            <StatusBadge value={k} /> <span className="font-bold">{v}</span>
          </div>
        ))}
        {Object.keys(s.ordersByStatus).length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
      </div>
    </div>
  );
}

function Users() {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/admin/users", { params: { role: role || undefined, search: search || undefined, limit: 50 } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const toggle = async (u) => {
    try {
      await api.patch(`/admin/users/${u._id}/status`, { isActive: !u.isActive });
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}? ${u.role === "farmer" ? "Their products will be deleted too." : ""}`)) return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <Alert>{error}</Alert>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input max-w-40" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="farmer">Farmers</option>
          <option value="buyer">Buyers</option>
          <option value="admin">Admins</option>
        </select>
        <input className="input max-w-xs" placeholder="Search name or email" value={search}
          onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <button className="btn btn-outline" onClick={load}>Search</button>
      </div>

      {!data ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Joined</th><th>Status</th><th /></tr></thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar user={u} size={32} />
                      <div><p className="font-semibold">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="capitalize">{u.role}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{fmtDate(u.createdAt)}</td>
                  <td><span className={u.isActive ? "text-green-400" : "text-red-400"}>{u.isActive ? "Active" : "Blocked"}</span></td>
                  <td>
                    {u.role !== "admin" && (
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-outline btn-sm" onClick={() => toggle(u)}>{u.isActive ? "Block" : "Unblock"}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(u)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/orders", { params: { status: status || undefined, limit: 50 } }).then((r) => setData(r.data));
  }, [status]);

  return (
    <div>
      <select className="input mb-4 max-w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {!data ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead><tr><th>Order</th><th>Buyer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th></tr></thead>
            <tbody>
              {data.orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.buyer?.name}<p className="text-xs text-muted">{o.buyer?.email}</p></td>
                  <td>{o.items.length}</td>
                  <td className="font-semibold">{inr(o.totalAmount)}</td>
                  <td><StatusBadge value={o.status} /></td>
                  <td><StatusBadge value={o.paymentStatus} /></td>
                  <td>{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.orders.length === 0 && <p className="p-6 text-center text-sm text-muted">No orders.</p>}
        </div>
      )}
    </div>
  );
}

function Payments() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/admin/payments", { params: { limit: 50 } }).then((r) => setData(r.data));
  }, []);
  if (!data) return <Spinner />;

  return (
    <div className="card overflow-x-auto">
      <table className="table">
        <thead><tr><th>Buyer</th><th>Order</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {data.payments.map((p) => (
            <tr key={p._id}>
              <td>{p.buyer?.name}</td>
              <td>#{String(p.order).slice(-8).toUpperCase()}</td>
              <td className="uppercase">{p.method}</td>
              <td className="font-semibold">{inr(p.amount)}</td>
              <td><StatusBadge value={p.status} /></td>
              <td>{fmtDate(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.payments.length === 0 && <p className="p-6 text-center text-sm text-muted">No payments.</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">Admin dashboard</h1>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} className={`chip ${tab === t ? "chip-active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === "Overview" && <Overview />}
      {tab === "Users" && <Users />}
      {tab === "Orders" && <Orders />}
      {tab === "Payments" && <Payments />}
    </div>
  );
}
