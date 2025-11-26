import { useEffect, useState } from "react";
import { apiGetMyReviews } from "../api";
import type { MyReviewItem } from "../type";

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

const ProfilePage = () => {
  const [reviews, setReviews] = useState<MyReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMyReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie profilu...</p>;

  return (
    <div>
      <h2>Mój profil</h2>

      <h3>Moje recenzje</h3>

      {reviews.length === 0 && <p>Nie masz jeszcze recenzji.</p>}

      <table>
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
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.productName}</td>
              <td>{r.rating}/5</td>
              <td>{r.title}</td>
              <td style={{ color: statusColor(r.status), fontWeight: "bold" }}>
                {r.status}
              </td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePage;
export {ProfilePage};
