import { useEffect, useState } from "react";
import { apiGetMyReviews, apiDeleteMyReview } from "../api";
import type { MyReviewItem } from "../type";
import { useAuth } from "../auth";

const statusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Pending":
      return "orange";
    default:
      return "gray";
  }
};

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
    <div>
      <h2>Mój profil</h2>

      {/*  DANE UŻYTKOWNIKA */}
      <section style={{ marginBottom: "1.5rem" }}>
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

      {reviews.length === 0 && <p>Nie masz jeszcze recenzji.</p>}

      {reviews.length > 0 && (
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
                <td
                  style={{
                    color: statusColor(r.status),
                    fontWeight: "bold",
                  }}
                >
                  {r.status}
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
      )}
    </div>
  );
};

export default ProfilePage;
export {ProfilePage};
