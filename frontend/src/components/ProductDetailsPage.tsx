
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCreateReview, apiGetProduct, apiGetReviewsForProduct } from "../api";
import type { ProductDetails, ReviewItem } from "../type";
import { useAuth } from "../auth";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const [p, r] = await Promise.all([
          apiGetProduct(productId),
          apiGetReviewsForProduct(productId),
        ]);
        setProduct(p);
        setReviews(r);
      } catch (err: any) {
        setError(err.message || "Błąd podczas ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      await apiCreateReview({
        productId,
        rating,
        title,
        body,
      });

      // recenzja jest Pending, więc nie zobaczymy jej w liście dopóki admin nie zatwierdzi
      setTitle("");
      setBody("");
      setRating(5);
      alert("Recenzja została wysłana do akceptacji admina.");
    } catch (err: any) {
      setSubmitError(err.message || "Nie udało się dodać recenzji");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div>Nie znaleziono produktu</div>;

  return (
    <div className="product-details-page">
      <h2>{product.name}</h2>
      <p>
        <strong>Marka:</strong> {product.brand}
      </p>
      <p>
        <strong>Kategoria:</strong> {product.category ?? "-"}
      </p>

      <section className="reviews-section">
        <h3>Recenzje</h3>
        {averageRating !== null && (
          <p>
            Średnia ocena: <strong>{averageRating.toFixed(2)}</strong> / 5 ({reviews.length}{" "}
            opinii)
          </p>
        )}
        {reviews.length === 0 && <p>Brak zatwierdzonych recenzji dla tego produktu.</p>}

        <ul className="reviews-list">
          {reviews.map((r) => (
            <li key={r.id} className="review-item">
              <div className="review-header">
                <span className="review-rating">Ocena: {r.rating}/5</span>
                <span className="review-date">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <h4>{r.title}</h4>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="add-review-section">
        <h3>Dodaj recenzję</h3>
        {!auth.isAuthenticated ? (
          <p>Aby dodać recenzję, musisz się zalogować.</p>
        ) : (
          <form onSubmit={handleSubmitReview} className="form">
            <label>
              Ocena (1–5)
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tytuł
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              Treść recenzji
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </label>

            {submitError && <div className="error">{submitError}</div>}

            <button type="submit" disabled={submitLoading}>
              {submitLoading ? "Wysyłanie..." : "Wyślij recenzję"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default ProductDetailsPage;
