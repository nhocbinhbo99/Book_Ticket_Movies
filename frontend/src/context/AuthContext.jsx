import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const AUTH_TOKEN_KEY = "tf_token";
const AUTH_USER_KEY = "tf_user";

function normalizeToken(token = "") {
  const normalized = String(token || "").trim();

  return normalized && normalized !== "null" && normalized !== "undefined"
    ? normalized
    : "";
}

function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function readStoredAuth() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const savedToken = normalizeToken(localStorage.getItem(AUTH_TOKEN_KEY));
  const savedUser = readStoredUser();

  if (savedToken && savedUser) {
    return { user: savedUser, token: savedToken };
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const [{ user, token }, setAuth] = useState(readStoredAuth);
  const loading = false;

  const login = (userData, jwtToken) => {
    const cleanToken = normalizeToken(jwtToken);

    if (!userData || !cleanToken) {
      throw new Error("Server did not return a valid login token");
    }

    setAuth({ user: userData, token: cleanToken });
    localStorage.setItem(AUTH_TOKEN_KEY, cleanToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateUser = (newUserData) => {
    setAuth((current) => ({ ...current, user: newUserData }));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserData));
  };

  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
