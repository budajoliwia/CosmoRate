// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    ["nav-link", isActive ? "is-active" : ""].filter(Boolean).join(" ");

  return (
    <div className="app">
      <header className="app-header">
        <div className="shell app-header-inner">
          <div className="brand">
            <img src={Logo} alt="CosmoRate logo" className="brand-logo" />
            <div className="brand-copy">
              <span className="brand-kicker">CosmoRate</span>
              
            </div>
          </div>

          <nav className="main-nav">
            <NavLink to="/products" className={navLinkClass}>
              Produkty
            </NavLink>

            {isAdmin && (
              <>
                <NavLink to="/admin" className={navLinkClass}>
                  Panel admina
                </NavLink>
                <NavLink to="/admin/products" className={navLinkClass}>
                  Produkty (admin)
                </NavLink>
                <NavLink to="/admin/categories" className={navLinkClass}>
                  Kategorie (admin)
                </NavLink>
                <NavLink to="/admin/reviews" className={navLinkClass}>
                  Recenzje (admin)
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <NavLink to="/profile" className={navLinkClass}>
                Mój profil
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <button
                type="button"
                className="logout-btn ghost-button"
                onClick={logout}
              >
                Wyloguj
              </button>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Zaloguj
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Rejestracja
                </NavLink>
              </>
            )}

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "plum" ? "🌿 Oliwkowy" : "🍇 Śliwkowy"}
            </button>
          </div>
        </div>
      </header>

      <section className="app-hero">
        <div className="shell app-hero-inner">
          <h1>Odkrywaj produkty beauty z opiniami społeczności</h1>
          <p>
            Wybieraj kosmetyki świadomie dzięki transparentnym recenzjom i
            sprawdzonym rekomendacjom użytkowniczek.
          </p>
          <div className="hero-badges">
            <span className="pill">Recenzje społeczności</span>
            <span className="pill">Zaufane opinie</span>
            <span className="pill">Odkrywaj produkty</span>
          </div>
        </div>
      </section>

      <main className="app-main">
        <div className="shell">
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
        </div>
      </main>
    </div>
  );
};

export default App;
