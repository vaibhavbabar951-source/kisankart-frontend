import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api/axios";
import Alert from "../components/Alert";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "buyer" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append("image", file);
      const user = await signup(fd);
      navigate(user.role === "farmer" ? "/farmer/products" : "/", { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-8">
      <form onSubmit={submit} className="card p-6">
        <h1 className="mb-1 text-2xl font-extrabold">Create account</h1>
        <p className="mb-5 text-sm text-muted">Join KisanKart as a buyer or a farmer</p>
        <Alert>{error}</Alert>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {[
            ["buyer", "🛒 I want to buy"],
            ["farmer", "🌾 I am a farmer"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              onClick={() => setForm({ ...form, role: value })}
              className={`btn ${form.role === value ? "btn-primary" : "btn-outline"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-3">
          <label className="label">Full name</label>
          <input className="input" required value={form.name} onChange={set("name")} />
        </div>
        <div className="mb-3">
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={set("email")} />
        </div>
        <div className="mb-3">
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="mb-3">
          <label className="label">Password (min 6 characters)</label>
          <input className="input" type="password" minLength={6} required value={form.password} onChange={set("password")} />
        </div>
        <div className="mb-5">
          <label className="label">Profile photo (optional, JPG/PNG/WEBP, max 2 MB)</label>
          <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFile(e.target.files[0] || null)} />
        </div>

        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Creating..." : "Sign up"}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Already registered? <Link to="/login" className="font-semibold text-accent">Login</Link>
        </p>
      </form>
    </div>
  );
}
