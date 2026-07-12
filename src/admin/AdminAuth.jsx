import React, { useState } from "react";
import { AdminAuthContext } from "./useAdminAuth";

const SESSION_KEY = "st_admin_unlocked";
// Client-side gate only -- this site has no backend to verify a password
// against, so this keeps casual visitors out but isn't real security.
const ADMIN_PASSWORD = "wayeducation2026";

export function AdminAuthProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  return (
    <AdminAuthContext.Provider value={{ unlocked, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
