// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import { useAuth } from "./auth";
import "./App.css";

const App: React.FC = () => {
  const { isAuthenticated,  logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>CosmoRate</h1>
        <nav>
          <Link to="/products">Produkty</Link>
          {isAuthenticated ? (
            <>
              {/* Tu potem dodamy linki admina, jeśli chcesz */}
              <button onClick={logout} className="logout-btn">
                Wyloguj
              </button>
            </>
          ) : (
            <Link to="/login">Zaloguj</Link>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          {/* tu kiedyś dodamy ścieżki dla admina */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
