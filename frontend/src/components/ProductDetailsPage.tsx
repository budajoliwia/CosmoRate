// src/components/ProductDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../api";
import type { ProductDetails, ReviewItem, CreateReviewDto } from "../type";
import { useAuth } from "../auth";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pola formularza dodawania opinii
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.apiGetProduct(productId),
      api.apiGetReviewsForProduct(productId),
    ])
      .then(([p, revs]) => {
        setProduct(p);
        setReviews(revs);
      })
      .catch((err: any) =>
        setError(err.message || "Nie udało się pobrać danych produktu")
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setSavingReview(true);
    setReviewMessage(null);

    const dto: CreateReviewDto = {
      productId,
      rating,
      title,
      body,
    };

    try {
      await api.apiCreateReview(dto);
      setReviewMessage(
        "Twoja recenzja została zapisana i czeka na akceptację administratora."
      );
      setRating(5);
      setTitle("");
      setBody("");
      // odświeżamy listę tylko Approved – nowej recenzji i tak nie będzie w tym widoku,
      // bo backend zwraca tylko zatwierdzone
      const approved = await api.apiGetReviewsForProduct(productId);
      setReviews(approved);
    } catch (err: any) {
      setReviewMessage(err.message || "Nie udało się dodać recenzji.");
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Produkt nie został znaleziony.</p>;

  return (
    <div className="product-details-page">
      <h2>{product.name}</h2>

      {/* ZDJĘCIE PRODUKTU */}
      {product.imageUrl && (
        <div style={{ marginBottom: "1rem" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: "250px", borderRadius: "4px" }}
          />
        </div>
      )}

      <p>
        <strong>Marka:</strong> {product.brand}
      </p>
      <p>
        <strong>Kategoria:</strong> {product.category ?? "-"}
      </p>

      <hr />

      <h3>Recenzje</h3>
      {reviews.length === 0 && <p>Brak zatwierdzonych recenzji dla tego produktu.</p>}
      {reviews.length > 0 && (
        <ul>
          {reviews.map((r) => (
            <li key={r.id} style={{ marginBottom: "0.75rem" }}>
              <strong>{r.rating}/5</strong> – {r.title}
              <br />
              <span>{r.body}</span>
              <br />
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* Formularz dodawania opinii – tylko dla zalogowanego */}
      <h3>Dodaj swoją opinię</h3>
      {!isAuthenticated && (
        <p>Aby dodać recenzję, musisz być zalogowana/zalogowany.</p>
      )}

      {isAuthenticated && (
        <form onSubmit={handleAddReview} className="form">
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
              rows={4}
            />
          </label>

          {reviewMessage && <p>{reviewMessage}</p>}

          <button type="submit" disabled={savingReview}>
            {savingReview ? "Zapisywanie..." : "Wyślij recenzję"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductDetailsPage;
export { ProductDetailsPage };
