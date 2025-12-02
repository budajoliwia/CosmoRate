import { useEffect, useState } from "react";
import { apiGetMyReviews, apiDeleteMyReview } from "../api";
import type { MyReviewItem } from "../type";
import { useAuth } from "../auth";


// spróbujemy wyciągnąć e-mail z tokena, ale jak go nie ma – pokażemy informację
function getEmailFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as any;

    //  różne typowe nazwy claimów
    return payload.email || payload.unique_name || payload.sub || null;
  } catch {
    return null;
  }
}

const ProfilePage = () => {
  const { user } = useAuth();
  const email = getEmailFromToken(user.token);

  const [reviews, setReviews] = useState<MyReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMyReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Na pewno usunąć tę recenzję?")) return;
    await apiDeleteMyReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <p>Ładowanie profilu...</p>;

  return (
    <div className="profile-page page">
      <div className="card profile-card">
        <div className="page-heading">
          <p className="eyebrow">Twoje konto</p>
          <h2>Mój profil</h2>
          <p>Podgląd danych konta i historii recenzji.</p>
        </div>

        <section className="info-list">
          <p>
            <strong>E-mail:</strong> {email ?? "(brak w tokenie)"}
          </p>
          <p>
            <strong>ID użytkownika:</strong> {user.userId ?? "nieznane"}
          </p>
          <p>
            <strong>Liczba recenzji:</strong> {reviews.length}
          </p>
        </section>

        <h3>Moje recenzje</h3>

        {reviews.length === 0 && (
          <p className="products-empty">Nie masz jeszcze recenzji.</p>
        )}

        {reviews.length > 0 && (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Ocena</th>
                  <th>Tytuł</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.productName}</td>
                    <td>{r.rating}/5</td>
                    <td>{r.title}</td>
                    <td>
                      <span
                        className={`status-pill status-${r.status.toLowerCase()}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      {r.status === "Pending" ? (
                        <button onClick={() => handleDelete(r.id)}>Usuń</button>
                      ) : (
                        "-"
                      )}
                    </td>
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

export default ProfilePage;
export {ProfilePage};
