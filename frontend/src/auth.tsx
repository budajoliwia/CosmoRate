import React, { createContext, useContext, useEffect, useState, type ReactElement } from "react";
import type { AuthContextType, AuthUser, DecodedToken } from "./type";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): AuthUser {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) {
      return { userId: null, role: null, token };
    }

    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload: DecodedToken = JSON.parse(json);

    const roleClaim =
      payload.role ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    let role: string | null = null;
    if (Array.isArray(roleClaim)) {
      role = roleClaim[0] ?? null;
    } else if (typeof roleClaim === "string") {
      role = roleClaim;
    }

    const userIdStr =
      payload.sub ??
      payload.nameid ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    return {
      userId: Number.isNaN(userId) ? null : userId,
      role: role ?? null,
      token,
    };
  } catch (e) {
    console.error("Token decode failed", e);
    return { userId: null, role: null, token };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({
    userId: null,
    role: null,
    token: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setUser(decodeToken(stored));
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ userId: null, role: null, token: null });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user.token,
    isAdmin: user.role === "Admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

// Komponent do ochrony tras
export const RequireAuth: React.FC<{ children: ReactElement }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};