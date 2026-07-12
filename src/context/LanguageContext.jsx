import React, { useEffect, useMemo, useState } from "react";
import { STRINGS as BASE_STRINGS } from "../data/translations";
import { LanguageContext } from "./useLanguage";
import { loadOverride, saveOverride, clearOverride } from "../admin/storage";

function mergeStrings(base, override) {
  if (!override) return base;
  const merged = {};
  for (const langKey of Object.keys(base)) {
    merged[langKey] = { ...base[langKey], ...(override[langKey] || {}) };
  }
  return merged;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("st_lang") || "en");
  const [override, setOverride] = useState(() => loadOverride("strings", null));

  useEffect(() => {
    localStorage.setItem("st_lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));
  const strings = useMemo(() => mergeStrings(BASE_STRINGS, override), [override]);
  const t = strings[lang];
  const isRtl = lang === "ar";

  const updateString = (langKey, key, value) => {
    setOverride((prev) => {
      const next = { ...(prev || {}), [langKey]: { ...((prev && prev[langKey]) || {}), [key]: value } };
      saveOverride("strings", next);
      return next;
    });
  };

  const resetStrings = () => {
    clearOverride("strings");
    setOverride(null);
  };

  // Bulk-restore from an imported backup: the imported object is already a
  // complete merged { en, ar } string set, so it replaces the override wholesale.
  const restoreStrings = (fullStrings) => {
    setOverride(fullStrings);
    saveOverride("strings", fullStrings);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRtl, strings, updateString, resetStrings, restoreStrings }}>
      {children}
    </LanguageContext.Provider>
  );
}
