import { createContext, useContext } from "react";

// The context object and its consumer hook live together in this
// non-component file; AdminAuth.jsx keeps only the <AdminAuthProvider>
// component. Keeps Vite Fast Refresh (and the linter) fully happy.
export const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}
