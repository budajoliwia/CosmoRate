// src/components/ProductsPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetProducts } from "../api";
import type { ProductListItem } from "../type";
import { useEffect } from "react";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiGetProducts()
      .then(setProducts)
      .catch((err: any) => setError(err.message || "Błąd podczas ładowania produktów"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const text = `${p.name} ${p.brand} ${p.category ?? ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [products, query]);

  return (
    <div className="products-page page">
      <div className="page-heading">
        <p className="eyebrow">Biblioteka produktów</p>
        <h2>Wyszukiwarka produktów</h2>
        <p>
          Znajdź kosmetyk po nazwie, marce lub kategorii i sprawdź opinie innych
          użytkowników.
        </p>
      </div>

      <div className="search-card">
        <div className="input-with-icon">
          <span className="input-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            className="input-field"
            placeholder='Szukaj: np. „serum”, „The Ordinary”, „perfumy”…'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && filtered.length === 0 && (
        <p className="products-empty">
          Brak produktów spełniających kryteria wyszukiwania.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="products-grid">
  {filtered.map((p) => (
    <div className="product-card" key={p.id}>
      <div className="product-card-image">
        {p.imageUrl && (
          <img src={p.imageUrl} alt={p.name} />
        )}
      </div>

      <h3>{p.name}</h3>

      <div className="product-card-meta">
        <span>{p.brand}</span>
        <span>{p.category ?? "Bez kategorii"}</span>
      </div>

      <button onClick={() => navigate(`/products/${p.id}`)}>
        Szczegóły i recenzje
      </button>
    </div>
  ))}
</div>
      )}
    </div>
  );
};

export default ProductsPage;
export { ProductsPage };
