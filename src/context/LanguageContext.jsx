import React, { useEffect, useMemo, useRef, useState } from "react";
import { STRINGS as BASE_STRINGS } from "../data/translations";
import { LanguageContext } from "./useLanguage";
import { apiFetch } from "../lib/api";

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
  const [override, setOverride] = useState(null);
  const saveTimerRef = useRef(undefined);

  useEffect(() => {
    localStorage.setItem("st_lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));
  const strings = useMemo(() => mergeStrings(BASE_STRINGS, override), [override]);
  const t = strings[lang];
  const isRtl = lang === "ar";

  useEffect(() => {
    let cancelled = false;

    const loadSiteCopy = async () => {
      try {
        const data = await apiFetch("/api/cms/site-copy");
        if (!cancelled && data && Object.keys(data).length > 0) {
          setOverride(data);
        }
      } catch {
        if (!cancelled) {
          setOverride(null);
        }
      }
    };

    loadSiteCopy();
    return () => {
      cancelled = true;
    };
  }, []);

  const queueSave = (next) => {
    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      apiFetch("/api/cms/site-copy", {
        method: "PATCH",
        body: JSON.stringify({ data: next }),
      }).catch(() => {
        // Keep local edits visible; a failed save can be retried by the next edit.
      });
    }, 250);
  };

  const updateString = (langKey, key, value) => {
    setOverride((prev) => {
      const next = { ...mergeStrings(BASE_STRINGS, prev), [langKey]: { ...(((prev && prev[langKey]) || BASE_STRINGS[langKey]) ?? {}), [key]: value } };
      queueSave(next);
      return next;
    });
  };

  const resetStrings = () => {
    apiFetch("/api/cms/site-copy", {
      method: "PATCH",
      body: JSON.stringify({ data: BASE_STRINGS }),
    }).catch(() => {
      // Leave the local reset visible even if the server call fails.
    });
    setOverride(null);
  };

  // Bulk-restore from an imported backup: the imported object is already a
  // complete merged { en, ar } string set, so it replaces the override wholesale.
  const restoreStrings = (fullStrings) => {
    setOverride(fullStrings);
    queueSave(fullStrings);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRtl, strings, updateString, resetStrings, restoreStrings }}>
      {children}
    </LanguageContext.Provider>
  );
}
