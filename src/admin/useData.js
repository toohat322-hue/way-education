import { createContext, useContext } from "react";

// The context object and its consumer hook live together in this
// non-component file; DataContext.jsx keeps only the <DataProvider>
// component. Keeps Vite Fast Refresh (and the linter) fully happy.
export const DataContext = createContext(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
