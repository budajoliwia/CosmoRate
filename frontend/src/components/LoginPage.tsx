
import React, { useState } from "react";
import  { useNavigate, useLocation } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation() as any; // nie komplikujemy typów
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.apiLogin({ email, password });
      auth.login(res.token);

      const from = location.state?.from?.pathname || "/products";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Nie udało się zalogować");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Hasło
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
