import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Avatar from "./Avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const showCart = !user || user.role === "buyer";

  const onSearch = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/?search=${encodeURIComponent(q.trim())}` : "/");
  };

  const links = [];
  if (user?.role === "buyer") links.push(["My Orders", "/orders"]);
  if (user?.role === "farmer") {
    links.push(["My Products", "/farmer/products"], ["Add Product", "/farmer/products/new"], ["Orders Received", "/farmer/orders"]);
  }
  if (user?.role === "admin") links.push(["Admin Dashboard", "/admin"]);
  if (user) links.push(["My Profile", "/profile"]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-accent">Kisan</span>Kart
        </Link>

        <form onSubmit={onSearch} className="order-last flex w-full gap-2 md:order-none md:max-w-xl md:flex-1">
          <input
            className="input"
            placeholder="Search vegetables, fruits, grains..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {showCart && (
            <Link to="/cart" className="btn btn-outline relative">
              🛒 Cart
              {count > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                <Avatar user={user} />
                <span className="hidden text-sm font-semibold sm:inline">{user.name.split(" ")[0]}</span>
              </button>
              {open && (
                <>
                  <div className="fixed inset-0" onClick={() => setOpen(false)} />
                  <div className="card absolute right-0 mt-2 w-52 overflow-hidden shadow-xl">
                    <div className="border-b border-line px-4 py-2 text-xs text-muted">
                      Signed in as <span className="font-semibold text-white">{user.role}</span>
                    </div>
                    {links.map(([label, to]) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-surface2 hover:text-accent"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-surface2"
                      onClick={() => {
                        setOpen(false);
                        logout();
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
