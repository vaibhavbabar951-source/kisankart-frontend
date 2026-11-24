import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../../api/axios";
import ProductImage from "../../components/ProductImage";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import { cap, inr } from "../../constants";

export default function MyProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/products/my")
      .then((r) => setProducts(r.data.products))
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (!products) return error ? <Alert>{error}</Alert> : <Spinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">My products</h1>
        <Link to="/farmer/products/new" className="btn btn-primary">+ Add product</Link>
      </div>
      <Alert>{error}</Alert>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">You have not added any products yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} className="h-10 w-10 rounded" />
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td>{cap(p.category)}</td>
                  <td>{inr(p.price)}/{p.unit}</td>
                  <td>{p.quantity} {p.unit}</td>
                  <td>
                    <span className={p.isAvailable && p.quantity > 0 ? "text-green-400" : "text-red-400"}>
                      {p.isAvailable && p.quantity > 0 ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link to={`/farmer/products/${p._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Delete</button>
                    </div>
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
