import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername]= useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Hasła muszą być takie same.");
      return;
    }

    setLoading(true);
    try {
      await api.apiRegister({
        email,
        username,
        password,
        confirmPassword: confirm,
      });

      setSuccess("Konto zostało utworzone. Możesz się zalogować.");
      // po krótkiej chwili przekieruj do logowania
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Nie udało się zarejestrować.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Rejestracja</h2>

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
            Nazwa użytkownika
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

        <label>
          Powtórz hasło
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Rejestrowanie..." : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
export {RegisterPage};