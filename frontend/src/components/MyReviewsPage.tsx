import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import type { MyReviewItem } from "../type";

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<MyReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.apiGetMyReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Nie udało się pobrać Twoich recenzji.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  return (
    <div className="my-reviews-page page">
      <div className="card">
        <div className="page-heading">
          <p className="eyebrow">Twoja aktywność</p>
          <h2>Moje recenzje</h2>
          <p>Śledź postęp moderacji swoich opinii.</p>
        </div>

        {loading && <p>Ładowanie...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && reviews.length === 0 && (
          <p className="products-empty">
            Nie dodałaś/eś jeszcze żadnych recenzji.
          </p>
        )}

        {!loading && reviews.length > 0 && (
          <div className="table-card">
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Ocena</th>
                  <th>Tytuł</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.productId ? (
                        <Link to={`/products/${r.productId}`}>
                          {r.productName ?? "(brak nazwy)"}
                        </Link>
                      ) : (
                        r.productName ?? "(brak nazwy)"
                      )}
                    </td>
                    <td>{r.rating}/5</td>
                    <td>{r.title}</td>
                    <td>
                      <span
                        className={`status-pill status-${r.status.toLowerCase()}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
export {MyReviewsPage};