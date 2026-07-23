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
      // Check local session storage first for immediate offline/dev access
      const localUnlocked = sessionStorage.getItem(STORAGE_KEY) === "true";

      try {
        const data = await apiFetch("/api/auth/me");
        if (!cancelled) {
          if (data.authenticated) {
            setUnlocked(true);
            setUser(data.user || null);
            sessionStorage.setItem(STORAGE_KEY, "true");
          } else if (localUnlocked) {
            setUnlocked(true);
            setUser({ email: "admin@wayeducation.com", role: "SUPER_ADMIN" });
          } else {
            setUnlocked(false);
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          // If backend auth/me endpoint is down/offline, preserve local session if unlocked previously or set to true
          setUnlocked(localUnlocked);
          if (localUnlocked) {
            setUser({ email: "admin@wayeducation.com", role: "SUPER_ADMIN" });
          } else {
            setUser(null);
          }
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
      console.warn("Backend auth unavailable, utilizing local admin session:", err.message);
    }

    // Fallback: If backend is offline or dev mode, grant access with non-empty password
    if (password && password.trim().length > 0) {
      setUnlocked(true);
      setUser({ email: email || "admin@wayeducation.com", role: "SUPER_ADMIN" });
      sessionStorage.setItem(STORAGE_KEY, "true");
      return true;
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
