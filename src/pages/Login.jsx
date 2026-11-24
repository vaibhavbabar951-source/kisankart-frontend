import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api/axios";
import Alert from "../components/Alert";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(email, password);
      const home = user.role === "farmer" ? "/farmer/products" : user.role === "admin" ? "/admin" : "/";
      navigate(location.state?.from || home, { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <form onSubmit={submit} className="card p-6">
        <h1 className="mb-1 text-2xl font-extrabold">Welcome back</h1>
        <p className="mb-5 text-sm text-muted">Login to your KisanKart account</p>
        <Alert>{error}</Alert>
        <div className="mb-3">
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-5">
          <label className="label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          New here? <Link to="/signup" className="font-semibold text-accent">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
