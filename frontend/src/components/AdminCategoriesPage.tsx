// src/components/AdminCategoriesPage.tsx
import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { Category } from "../type";

const AdminCategoriesPage: React.FC=() => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await api.apiGetCategories();
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || "Błąd podczas ładowania kategorii");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Na pewno chcesz usunąć tę kategorię?")) return;
    setError(null);
    try {
      await api.apiDeleteCategory(id);
      await loadCategories();
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || "Nie udało się usunąć kategorii");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nazwa kategorii jest wymagana.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      if (editingId === null) {
        await api.apiCreateCategory(name);
      } else {
        await api.apiUpdateCategory(editingId, name);
      }
      await loadCategories();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Nie udało się zapisać kategorii");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-categories-page page">
      <div className="page-heading">
        <p className="eyebrow">Panel admina</p>
        <h2>Zarządzanie kategoriami</h2>
        <p>Dodaj kategorię, aby ułatwić wyszukiwanie produktów.</p>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && (
        <div className="table-card">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nazwa</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(c)}>
                      Edytuj
                    </button>{" "}
                    <button type="button" onClick={() => void handleDelete(c.id)}>
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3}>Brak kategorii.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <section className="category-form-section card soft-card">
        <h3>
          {editingId === null
            ? "Nowa kategoria"
            : `Edytuj kategorię #${editingId}`}
        </h3>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Nazwa kategorii
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Zapisywanie..."
                : editingId === null
                ? "Dodaj kategorię"
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

export default AdminCategoriesPage;
export { AdminCategoriesPage };