
import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../api";
import type { ProductListItem } from "../type";
import { useNavigate } from "react-router-dom";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Błąd podczas pobierania produktów");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="products-page">
      <h2>Wyszukiwarka produktów</h2>

      <input
        type="text"
        placeholder="Szukaj po nazwie, marce lub kategorii..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <div>Ładowanie...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <table className="products-table">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Marka</th>
              <th>Kategoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
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
                <td colSpan={4}>Brak produktów spełniających kryteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsPage;
