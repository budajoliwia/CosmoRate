// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import * as auth from "./auth";
import "./App.css";
import {AdminProductsPage} from "./components/AdminProductsPage";
import AdminCategoriesPage from "./components/AdminCategoriesPage";
import RegisterPage from "./components/RegisterPage";
import MyReviewsPage from "./components/MyReviewsPage";
import AdminReviewsPage from "./components/AdminReviewsPage";






const App: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = auth.useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>CosmoRate</h1>
        <nav>
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
    <Link to="/my/reviews">Moje recenzje</Link>
    {" | "}
    <button onClick={logout} className="logout-btn">
      Wyloguj
    </button>
  </>
) : (
  <>
    <Link to="/login">Zaloguj</Link>
    {" | "}
    <Link to="/register">Rejestracja</Link>
  </>
)}
</nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
            path="/my/reviews"
            element={
              isAuthenticated ? (
                <MyReviewsPage />
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
