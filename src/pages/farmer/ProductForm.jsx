import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../../api/axios";
import ProductImage from "../../components/ProductImage";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import { CATEGORIES, UNITS, cap } from "../../constants";

const EMPTY = {
  name: "", category: "vegetables", description: "", price: "", unit: "kg", quantity: "", isAvailable: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [currentImage, setCurrentImage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name, category: data.category, description: data.description || "",
          price: data.price, unit: data.unit, quantity: data.quantity, isAvailable: data.isAvailable,
        });
        setCurrentImage(data.image);
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const removeCurrentImage = async () => {
    try {
      await api.delete(`/products/${id}/image`);
      setCurrentImage("");
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      ["name", "category", "description", "price", "unit", "quantity"].forEach((k) => fd.append(k, form[k]));
      if (editing) fd.append("isAvailable", form.isAvailable);
      if (file) fd.append("image", file);

      if (editing) await api.put(`/products/${id}`, fd);
      else await api.post("/products", fd);
      navigate("/farmer/products");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={submit} className="card mx-auto max-w-2xl p-6">
      <h1 className="mb-5 text-2xl font-extrabold">{editing ? "Edit product" : "Add new product"}</h1>
      <Alert>{error}</Alert>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Product name</label>
          <input className="input" required value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{cap(c)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Unit</label>
          <select className="input" value={form.unit} onChange={set("unit")}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Price per unit (₹)</label>
          <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} />
        </div>
        <div>
          <label className="label">Stock quantity</label>
          <input className="input" type="number" min="0" required value={form.quantity} onChange={set("quantity")} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={set("description")} />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Product image (JPG/PNG/WEBP, max 2 MB)</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img src={preview} alt="preview" className="h-24 w-24 rounded-lg object-cover" />
            ) : (
              <ProductImage src={currentImage} className="h-24 w-24 rounded-lg" />
            )}
            <div className="space-y-2">
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} className="text-sm" />
              {editing && currentImage && !preview && (
                <button type="button" className="btn btn-danger btn-sm" onClick={removeCurrentImage}>
                  Remove current image
                </button>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Show this product to buyers
          </label>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Saving..." : editing ? "Save changes" : "Add product"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate("/farmer/products")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
