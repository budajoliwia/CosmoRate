// src/components/AdminProductsPage.tsx
import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { ProductListItem, Category, CreateProductDto } from "../type";

// <-- TU: eksport od razu jako named
export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateProductDto>({
    name: "",
    brand: "",
    categoryId: 0,
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        api.apiGetProducts(),
        api.apiGetCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || "Błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      brand: "",
      categoryId: categories[0]?.id ?? 0,
    });
  };

  const handleEdit = async (id: number) => {
    setError(null);
    try {
      const p = await api.apiGetProduct(id);
      setEditingId(id);
      setForm({
        name: p.name,
        brand: p.brand,
        categoryId: p.categoryId ?? 0,
      });
    } catch (err: any) {
      setError(err.message || "Nie udało się pobrać produktu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Na pewno chcesz usunąć ten produkt?")) return;
    setError(null);
    try {
      await api.apiDeleteProduct(id);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Nie udało się usunąć produktu");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!form.name.trim() || !form.brand.trim() || !form.categoryId) {
        setError("Uzupełnij wszystkie pola.");
        setSaving(false);
        return;
      }

      if (editingId === null) {
        await api.apiCreateProduct(form);
      } else {
        await api.apiUpdateProduct(editingId, form);
      }

      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Nie udało się zapisać produktu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-products-page">
      <h2>Zarządzanie produktami</h2>

      {loading && <div>Ładowanie...</div>}
      {error && <div className="error">{error}</div>}

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Marka</th>
            <th>Kategoria</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category ?? "-"}</td>
              <td>
                <button onClick={() => void handleEdit(p.id)}>Edytuj</button>{" "}
                <button onClick={() => void handleDelete(p.id)}>Usuń</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5}>Brak produktów.</td>
            </tr>
          )}
        </tbody>
      </table>

      <section className="product-form-section">
        <h3>
          {editingId === null ? "Nowy produkt" : `Edytuj produkt #${editingId}`}
        </h3>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Nazwa
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Marka
            <input
              type="text"
              value={form.brand}
              onChange={(e) =>
                setForm((f) => ({ ...f, brand: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Kategoria
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))
              }
              required
            >
              <option value={0}>-- wybierz kategorię --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Zapisywanie..."
                : editingId === null
                ? "Dodaj produkt"
                : "Zapisz zmiany"}
            </button>
            {editingId !== null && (
              <button type="button" onClick={resetForm}>
                Anuluj edycję
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};
