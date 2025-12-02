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
    <div className="admin-dashboard page">
      <div className="page-heading">
        <p className="eyebrow">Zarządzanie CosmoRate</p>
        <h2>Panel administratora</h2>
        <p>Błyskawiczny podgląd kluczowych metryk i ostatnich zdarzeń.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Użytkownicy</span>
          <span className="stat-value">{data.users}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Produkty</span>
          <span className="stat-value">{data.products}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kategorie</span>
          <span className="stat-value">{data.categories}</span>
        </div>
      </div>

      <section className="card soft-card stacked-section">
        <h3>Recenzje</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Łącznie</span>
            <span className="stat-value">{data.reviews.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Oczekujące</span>
            <span className="stat-value">{data.reviews.pending}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Zatwierdzone</span>
            <span className="stat-value">{data.reviews.approved}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Odrzucone</span>
            <span className="stat-value">{data.reviews.rejected}</span>
          </div>
        </div>
      </section>

      <section className="card soft-card stacked-section">
        <h3>Ostatnie logi (10)</h3>
        {data.lastLogs.length === 0 && <p>Brak logów.</p>}
        {data.lastLogs.length > 0 && (
          <ul className="timeline">
            {data.lastLogs.map((log) => (
              <li key={log.id} className="timeline-item">
                <div>
                  <strong>{log.action}</strong> –{" "}
                  {log.details ?? "(brak szczegółów)"}
                </div>
                <div className="timeline-time">
                  Użytkownik: {log.userId ?? "system"} |{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
