import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UNIVERSITIES as BASE_UNIVERSITIES } from "../data/universities";
import { DIRECTORY as BASE_DIRECTORY } from "../data/directory";
import { MAJORS as BASE_MAJORS } from "../data/majors";
import { FAQS as BASE_FAQS } from "../data/faqs";
import { SETTINGS as BASE_SETTINGS } from "../data/settings";
import { DataContext } from "./useData";
import { apiFetch } from "../lib/api";

const KEYS = {
  UNIVERSITIES: "way_cms_universities_v1",
  DIRECTORY: "way_cms_directory_v1",
  MAJORS: "way_cms_majors_v1",
  FAQS: "way_cms_faqs_v1",
  SETTINGS: "way_cms_settings_v1",
};
function loadStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}:`, err);
  }
  return fallback;
}

function saveStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save to localStorage key ${key}:`, err);
  }
}

function loadStoredUniversities(fallback) {
  try {
    const raw = localStorage.getItem(KEYS.UNIVERSITIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${KEYS.UNIVERSITIES}:`, err);
  }
  return fallback;
}

export function DataProvider({ children }) {
  const [universities, setUniversitiesState] = useState(() =>
    loadStoredUniversities(BASE_UNIVERSITIES)
  );

  const [directory, setDirectoryState] = useState(() =>
    loadStored(KEYS.DIRECTORY, BASE_DIRECTORY)
  );

  const [majors, setMajorsState] = useState(() =>
    loadStored(
      KEYS.MAJORS,
      BASE_MAJORS.map((major) => ({
        ...major,
        id: major.id || major.name.en.toLowerCase().replace(/\s+/g, "-"),
      }))
    )
  );

  const [faqs, setFaqsState] = useState(() =>
    loadStored(
      KEYS.FAQS,
      BASE_FAQS.map((faq, index) => ({
        ...faq,
        id: faq.id || `faq-${index + 1}`,
      }))
    )
  );

  const [settings, setSettingsState] = useState(() =>
    loadStored(KEYS.SETTINGS, BASE_SETTINGS)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Wrapped state setters that persist to localStorage automatically
  const setUniversities = useCallback((updater) => {
    setUniversitiesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStored(KEYS.UNIVERSITIES, next);
      return next;
    });
  }, []);

  const setDirectory = useCallback((updater) => {
    setDirectoryState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStored(KEYS.DIRECTORY, next);
      return next;
    });
  }, []);

  const setMajors = useCallback((updater) => {
    setMajorsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStored(KEYS.MAJORS, next);
      return next;
    });
  }, []);

  const setFaqs = useCallback((updater) => {
    setFaqsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStored(KEYS.FAQS, next);
      return next;
    });
  }, []);

  const updateSettingsState = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      saveStored(KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await apiFetch("/api/cms/bootstrap");
      if (Array.isArray(payload?.universities)) {
        setUniversities(payload.universities);
      }
      if (Array.isArray(payload?.directory)) {
        setDirectory(payload.directory);
      }
      if (Array.isArray(payload?.majors)) {
        setMajors(payload.majors);
      }
      if (Array.isArray(payload?.faqs)) {
        setFaqs(payload.faqs);
      }
      if (payload?.settings?.whatsapp) {
        updateSettingsState(payload.settings);
      }
    } catch (err) {
      console.warn("Bootstrap sync skipped:", err.message);
    } finally {
      setLoading(false);
    }
  }, [setUniversities, setDirectory, setMajors, setFaqs, updateSettingsState]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = useCallback(
    async (patch) => {
      await apiFetch("/api/cms/settings", {
        method: "PATCH",
        body: JSON.stringify({
          whatsapp: patch.whatsapp,
          websiteName: patch.websiteName,
          supportEmail: patch.supportEmail,
          supportPhone: patch.supportPhone,
        }),
      });
      updateSettingsState(patch);
      return patch;
    },
    [updateSettingsState]
  );

  // Clear local storage and reset to seed defaults
  const resetToDefaults = useCallback(() => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    setUniversitiesState(BASE_UNIVERSITIES);
    setDirectoryState(BASE_DIRECTORY);
    setMajorsState(
      BASE_MAJORS.map((major) => ({
        ...major,
        id: major.id || major.name.en.toLowerCase().replace(/\s+/g, "-"),
      }))
    );
    setFaqsState(
      BASE_FAQS.map((faq, index) => ({
        ...faq,
        id: faq.id || `faq-${index + 1}`,
      }))
    );
    setSettingsState(BASE_SETTINGS);
  }, []);

  const value = {
    universities,
    directory,
    majors,
    faqs,
    settings,
    loading,
    error,
    refresh,
    resetToDefaults,
    updateSettings,

    getUniversityById: useCallback(
      (id) => universities.find((u) => u.id === id),
      [universities]
    ),

    publicUniversities: useMemo(
      () =>
        universities
          .filter((u) => u.active !== false)
          .slice()
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
      [universities]
    ),

    addUniversity: async (u) => {
      const res = await apiFetch("/api/cms/universities", {
        method: "POST",
        body: JSON.stringify(u),
      });
      const created = res && res.id ? res : { ...u, id: u.id || `uni-${Date.now()}` };
      setUniversities((prev) => [created, ...prev]);
      return created;
    },
    updateUniversity: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/universities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...(updated || patch) } : u))
      );
      return updated || patch;
    },
    removeUniversity: async (id) => {
      await apiFetch(`/api/cms/universities/${id}`, { method: "DELETE" });
      setUniversities((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addDirectoryEntry: async (u) => {
      const res = await apiFetch("/api/cms/directory", {
        method: "POST",
        body: JSON.stringify(u),
      });
      const created = res && res.id ? res : { ...u, id: u.id || `dir-${Date.now()}` };
      setDirectory((prev) => [created, ...prev]);
      return created;
    },
    updateDirectoryEntry: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/directory/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setDirectory((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...(updated || patch) } : u))
      );
      return updated || patch;
    },
    removeDirectoryEntry: async (id) => {
      await apiFetch(`/api/cms/directory/${id}`, { method: "DELETE" });
      setDirectory((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addMajor: async (m) => {
      const res = await apiFetch("/api/cms/majors", {
        method: "POST",
        body: JSON.stringify(m),
      });
      const created = res && res.id ? res : { ...m, id: m.id || `major-${Date.now()}` };
      setMajors((prev) => [...prev, created]);
      return created;
    },
    updateMajor: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/majors/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setMajors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...(updated || patch) } : m))
      );
      return updated || patch;
    },
    removeMajor: async (id) => {
      await apiFetch(`/api/cms/majors/${id}`, { method: "DELETE" });
      setMajors((prev) => prev.filter((m) => m.id !== id));
      return true;
    },

    addFaq: async (f) => {
      const res = await apiFetch("/api/cms/faqs", {
        method: "POST",
        body: JSON.stringify(f),
      });
      const created = res && res.id ? res : { ...f, id: f.id || `faq-${Date.now()}` };
      setFaqs((prev) => [...prev, created]);
      return created;
    },
    updateFaq: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/faqs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...(updated || patch) } : f))
      );
      return updated || patch;
    },
    removeFaq: async (id) => {
      await apiFetch(`/api/cms/faqs/${id}`, { method: "DELETE" });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      return true;
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
