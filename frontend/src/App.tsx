// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import { AdminProductsPage } from "./components/AdminProductsPage";
import AdminCategoriesPage from "./components/AdminCategoriesPage";
import AdminReviewsPage from "./components/AdminReviewsPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import Logo from "./assets/LOGO_cosmorate.png";



import * as auth from "./auth";
import "./App.css";

type Theme = "plum" | "olive";

const App: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = auth.useAuth();

  // ---------------- MOTYW ----------------
  const [theme, setTheme] = useState<Theme>("plum");

  // wczytaj z localStorage przy starcie
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored === "olive" || stored === "plum" ? stored : "plum";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // aktualizuj atrybut na <html> i zapis w localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "plum" ? "olive" : "plum"));
  };
  // ---------------------------------------

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <img
              src={Logo}
              alt="CosmoRate logo"
              className="app-logo-image"
            />
            <span className="logo-text">CosmoRate</span>
          </div>

          <nav className="main-nav">
            <Link to="/products">Produkty</Link>

            {isAdmin && (
              <>
                <Link to="/admin">Panel admina</Link>
                <Link to="/admin/products">Produkty (admin)</Link>
                <Link to="/admin/categories">Kategorie (admin)</Link>
                <Link to="/admin/reviews">Recenzje (admin)</Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile">Mój profil</Link>
                <button
                  type="button"
                  className="nav-button logout-btn"
                  onClick={logout}
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Zaloguj</Link>
                <Link to="/register">Rejestracja</Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "plum" ? "🌿 Oliwkowy" : "🍇 Śliwkowy"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />

          {/* profil tylko dla zalogowanych – możesz dodać RequireAuth, ale zostawiamy tak jak masz */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin – prosta ochrona na podstawie isAdmin */}
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

          <Route
            path="/admin/products"
            element={
              isAdmin ? (
                <AdminProductsPage />
              ) : isAuthenticated ? (
                <Navigate to="/products" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/categories"
            element={
              isAdmin ? (
                <AdminCategoriesPage />
              ) : isAuthenticated ? (
                <Navigate to="/products" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/reviews"
            element={
              isAdmin ? (
                <AdminReviewsPage />
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
