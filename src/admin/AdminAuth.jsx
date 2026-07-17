import React, { useEffect, useState } from "react";
import { AdminAuthContext } from "./useAdminAuth";
import { apiFetch } from "../lib/api";

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
          setUnlocked(Boolean(data.authenticated));
          setUser(data.user || null);
        }
      } catch {
        if (!cancelled) {
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
      setUnlocked(Boolean(data.authenticated));
      setUser(data.user || null);
      return Boolean(data.authenticated);
    } catch {
      setUnlocked(false);
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort logout; local UI state is always cleared below.
    }
    setUnlocked(false);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ unlocked, booting, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
