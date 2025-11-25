// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import * as auth from "./auth";
import "./App.css";

const App: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = auth.useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>CosmoRate</h1>
        <nav>
          <Link to="/products">Produkty</Link>
          {isAdmin && <Link to="/admin">Panel admina</Link>}
          {isAuthenticated ? (
            <button onClick={logout} className="logout-btn">
              Wyloguj
            </button>
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

          {/* Ochrona trasy admina bez dodatkowego komponentu */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboardPage />
              ) : isAuthenticated ? (
                <Navigate to="/products" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
