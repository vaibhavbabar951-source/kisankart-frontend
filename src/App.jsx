import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import MyProducts from "./pages/farmer/MyProducts";
import ProductForm from "./pages/farmer/ProductForm";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-extrabold text-accent">404</h1>
      <p className="mt-2 text-muted">Page not found</p>
      <Link to="/" className="btn btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<ProtectedRoute roles={["buyer"]}><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={["buyer"]}><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/farmer/products" element={<ProtectedRoute roles={["farmer"]}><MyProducts /></ProtectedRoute>} />
          <Route path="/farmer/products/new" element={<ProtectedRoute roles={["farmer"]}><ProductForm /></ProtectedRoute>} />
          <Route path="/farmer/products/:id/edit" element={<ProtectedRoute roles={["farmer"]}><ProductForm /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute roles={["farmer"]}><FarmerOrders /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
