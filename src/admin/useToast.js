import { createContext, useContext } from "react";

// The context object and its consumer hook live together in this
// non-component file; Toast.jsx keeps only the <ToastProvider> component.
// Keeps Vite Fast Refresh (and the linter) fully happy.
export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
