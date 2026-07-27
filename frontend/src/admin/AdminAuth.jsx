import React, { useEffect, useState } from "react";
import { AdminAuthContext } from "./useAdminAuth";
import { apiFetch } from "../lib/api";

const STORAGE_KEY = "way_admin_unlocked";

export function AdminAuthProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const data = await apiFetch("/api/auth/me");
        if (!cancelled) {
          if (data.authenticated) {
            setUnlocked(true);
            setUser(data.user || null);
            sessionStorage.setItem(STORAGE_KEY, "true");
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
            setUnlocked(false);
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          // Any failure (network or auth error) means the session cannot be verified.
          sessionStorage.removeItem(STORAGE_KEY);
          setUnlocked(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setBooting(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ email, password }) => {
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.authenticated) {
        setUnlocked(true);
        setUser(data.user || null);
        sessionStorage.setItem(STORAGE_KEY, "true");
        return true;
      }
    } catch (err) {
      console.warn("Login failed:", err.message);
    }

    setUnlocked(false);
    setUser(null);
    return false;
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort logout
    }
    sessionStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ unlocked, booting, user, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
