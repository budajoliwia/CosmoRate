// src/components/AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { ReportsSummary } from "../type";

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.apiGetReportsSummary();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Nie udało się pobrać raportu");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Ładowanie raportu...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>Brak danych raportu.</div>;

  return (
    <div className="admin-dashboard">
      <h2>Panel administratora</h2>

      <section className="admin-stats">
        <h3>Statystyki</h3>
        <ul>
          <li>
            Użytkownicy: <strong>{data.users}</strong>
          </li>
          <li>
            Produkty: <strong>{data.products}</strong>
          </li>
          <li>
            Kategorie: <strong>{data.categories}</strong>
          </li>
          <li>
            Recenzje:
            <ul>
              <li>
                Łącznie: <strong>{data.reviews.total}</strong>
              </li>
              <li>
                Oczekujące: <strong>{data.reviews.pending}</strong>
              </li>
              <li>
                Zatwierdzone: <strong>{data.reviews.approved}</strong>
              </li>
              <li>
                Odrzucone: <strong>{data.reviews.rejected}</strong>
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="admin-logs">
        <h3>Ostatnie logi (10)</h3>
        {data.lastLogs.length === 0 && <p>Brak logów.</p>}
        <ul>
          {data.lastLogs.map((log) => (
            <li key={log.id}>
              <div>
                <strong>{log.action}</strong> – {log.details ?? "(brak szczegółów)"}
              </div>
              <div>
                Użytkownik: {log.userId ?? "system"} |{" "}
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
