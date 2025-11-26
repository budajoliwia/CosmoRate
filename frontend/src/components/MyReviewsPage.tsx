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
    <div className="my-reviews-page">
      <h2>Moje recenzje</h2>

      {loading && <div>Ładowanie...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && reviews.length === 0 && (
        <div>Nie dodałaś/eś jeszcze żadnych recenzji.</div>
      )}

      {!loading && reviews.length > 0 && (
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
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyReviewsPage;
export {MyReviewsPage};