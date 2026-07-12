import { createContext, useContext } from "react";

// The context object and its consumer hook live together in this
// non-component file; LanguageContext.jsx keeps only the <LanguageProvider>
// component. Keeps Vite Fast Refresh (and the linter) fully happy.
export const LanguageContext = createContext(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
