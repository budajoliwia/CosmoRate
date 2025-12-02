import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { PendingReviewItem } from "../type";

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<PendingReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.apiGetPendingReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Nie udało się pobrać recenzji do moderacji.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoadingId(id);
    setError(null);
    try {
      await api.apiApproveReview(id);
      await loadReviews();
    } catch (err: any) {
      setError(err.message || "Nie udało się zatwierdzić recenzji.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Na pewno odrzucić tę recenzję?")) return;
    setActionLoadingId(id);
    setError(null);
    try {
      await api.apiRejectReview(id);
      await loadReviews();
    } catch (err: any) {
      setError(err.message || "Nie udało się odrzucić recenzji.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="admin-reviews-page page">
      <div className="page-heading">
        <p className="eyebrow">Panel admina</p>
        <h2>Moderacja recenzji</h2>
        <p>Zatwierdzaj lub odrzucaj nowe opinie społeczności.</p>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && reviews.length === 0 && (
        <p className="products-empty">
          Brak recenzji oczekujących na moderację.
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="table-card">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produkt ID</th>
                <th>Użytkownik ID</th>
                <th>Ocena</th>
                <th>Tytuł</th>
                <th>Treść</th>
                <th>Data</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.productId}</td>
                  <td>{r.userId}</td>
                  <td>{r.rating}/5</td>
                  <td>{r.title}</td>
                  <td>{r.body}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => void handleApprove(r.id)}
                      disabled={actionLoadingId === r.id}
                    >
                      Zatwierdź
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => void handleReject(r.id)}
                      disabled={actionLoadingId === r.id}
                    >
                      Odrzuć
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default  AdminReviewsPage ; 
