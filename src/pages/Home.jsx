import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errMsg } from "../api/axios";
import ProductCard from "../components/ProductCard";
import CategoryBar from "../components/CategoryBar";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const page = Number(params.get("page") || 1);

  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/products", {
        params: { category: category || undefined, search: search || undefined, page, limit: 12 },
      })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  return (
    <div>
      <section className="card mb-2 bg-linear-to-r from-surface to-bg p-6 md:p-8">
        <h1 className="text-2xl font-extrabold md:text-4xl">
          Fresh from the <span className="text-accent">farm</span>, straight to you
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
          Buy vegetables, fruits, grains and more directly from farmers. No middlemen, better prices.
        </p>
      </section>

      <CategoryBar active={category} onChange={(c) => update({ category: c, page: "" })} />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {search ? `Results for "${search}"` : category ? category[0].toUpperCase() + category.slice(1) : "Latest products"}
        </h2>
        <span className="text-sm text-muted">{data.total} items</span>
      </div>

      <Alert>{error}</Alert>
      {loading ? (
        <Spinner />
      ) : data.products.length === 0 ? (
        <p className="py-16 text-center text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}

      <Pagination page={page} pages={data.pages} onChange={(n) => update({ page: n === 1 ? "" : String(n) })} />
    </div>
  );
}
