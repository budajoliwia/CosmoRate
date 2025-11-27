// src/components/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import type { ProductListItem } from "../type";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .apiGetProducts()
      .then(setProducts)
      .catch((err: any) =>
        setError(err.message || "Nie udało się pobrać produktów")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) return <p>Ładowanie produktów...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Wyszukiwarka produktów</h2>

      <input
        type="text"
        placeholder="Szukaj po nazwie, marce lub kategorii"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "1rem", width: "60%" }}
      />

      <table className="products-table">
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Nazwa</th>
            <th>Marka</th>
            <th>Kategoria</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                ) : (
                  "Brak"
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category ?? "-"}</td>
              <td>
                <button onClick={() => navigate(`/products/${p.id}`)}>
                  Szczegóły i recenzje
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5}>Brak produktów spełniających kryteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
export { ProductsPage };
