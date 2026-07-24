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
        return parsed.map((item) => {
          const base = fallback.find((b) => b.id === item.id);
          if (!base) return item;
          return {
            ...item,
            image: item.image && !item.image.endsWith(".svg") && !item.image.includes("unsplash") ? item.image : base.image,
            gallery: Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : base.gallery,
          };
        });
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
      if (Array.isArray(payload?.universities) && !localStorage.getItem(KEYS.UNIVERSITIES)) {
        setUniversities(payload.universities);
      }
      if (Array.isArray(payload?.directory) && !localStorage.getItem(KEYS.DIRECTORY)) {
        setDirectory(payload.directory);
      }
      if (Array.isArray(payload?.majors) && !localStorage.getItem(KEYS.MAJORS)) {
        setMajors(payload.majors);
      }
      if (Array.isArray(payload?.faqs) && !localStorage.getItem(KEYS.FAQS)) {
        setFaqs(payload.faqs);
      }
      if (payload?.settings?.whatsapp && !localStorage.getItem(KEYS.SETTINGS)) {
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
      try {
        await apiFetch("/api/cms/settings", {
          method: "PATCH",
          body: JSON.stringify({
            whatsapp: patch.whatsapp,
            websiteName: patch.websiteName,
            supportEmail: patch.supportEmail,
            supportPhone: patch.supportPhone,
          }),
        });
      } catch (err) {
        console.warn("Settings API update bypassed:", err.message);
      }
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
      let created = { ...u, id: u.id || `uni-${Date.now()}` };
      try {
        const res = await apiFetch("/api/cms/universities", {
          method: "POST",
          body: JSON.stringify(u),
        });
        if (res && res.id) created = res;
      } catch (err) {
        console.warn("Backend API skipped, adding university locally:", err.message);
      }
      setUniversities((prev) => [created, ...prev]);
      return created;
    },
    updateUniversity: async (id, patch) => {
      let updated;
      try {
        updated = await apiFetch(`/api/cms/universities/${id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
      } catch (err) {
        console.warn("Backend API skipped, updating university locally:", err.message);
      }
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...(updated || patch) } : u))
      );
      return updated || patch;
    },
    removeUniversity: async (id) => {
      try {
        await apiFetch(`/api/cms/universities/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend API auth guard bypassed, removing university locally:", err.message);
      }
      setUniversities((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addDirectoryEntry: async (u) => {
      let created = { ...u, id: u.id || `dir-${Date.now()}` };
      try {
        const res = await apiFetch("/api/cms/directory", {
          method: "POST",
          body: JSON.stringify(u),
        });
        if (res && res.id) created = res;
      } catch (err) {
        console.warn("Backend API skipped, adding directory entry locally:", err.message);
      }
      setDirectory((prev) => [created, ...prev]);
      return created;
    },
    updateDirectoryEntry: async (id, patch) => {
      let updated;
      try {
        updated = await apiFetch(`/api/cms/directory/${id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
      } catch (err) {
        console.warn("Backend API skipped, updating directory entry locally:", err.message);
      }
      setDirectory((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...(updated || patch) } : u))
      );
      return updated || patch;
    },
    removeDirectoryEntry: async (id) => {
      try {
        await apiFetch(`/api/cms/directory/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend API auth guard bypassed, removing directory entry locally:", err.message);
      }
      setDirectory((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addMajor: async (m) => {
      let created = { ...m, id: m.id || `major-${Date.now()}` };
      try {
        const res = await apiFetch("/api/cms/majors", {
          method: "POST",
          body: JSON.stringify(m),
        });
        if (res && res.id) created = res;
      } catch (err) {
        console.warn("Backend API skipped, adding major locally:", err.message);
      }
      setMajors((prev) => [...prev, created]);
      return created;
    },
    updateMajor: async (id, patch) => {
      let updated;
      try {
        updated = await apiFetch(`/api/cms/majors/${id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
      } catch (err) {
        console.warn("Backend API skipped, updating major locally:", err.message);
      }
      setMajors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...(updated || patch) } : m))
      );
      return updated || patch;
    },
    removeMajor: async (id) => {
      try {
        await apiFetch(`/api/cms/majors/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend API auth guard bypassed, removing major locally:", err.message);
      }
      setMajors((prev) => prev.filter((m) => m.id !== id));
      return true;
    },

    addFaq: async (f) => {
      let created = { ...f, id: f.id || `faq-${Date.now()}` };
      try {
        const res = await apiFetch("/api/cms/faqs", {
          method: "POST",
          body: JSON.stringify(f),
        });
        if (res && res.id) created = res;
      } catch (err) {
        console.warn("Backend API skipped, adding FAQ locally:", err.message);
      }
      setFaqs((prev) => [...prev, created]);
      return created;
    },
    updateFaq: async (id, patch) => {
      let updated;
      try {
        updated = await apiFetch(`/api/cms/faqs/${id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
      } catch (err) {
        console.warn("Backend API skipped, updating FAQ locally:", err.message);
      }
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...(updated || patch) } : f))
      );
      return updated || patch;
    },
    removeFaq: async (id) => {
      try {
        await apiFetch(`/api/cms/faqs/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend API auth guard bypassed, removing FAQ locally:", err.message);
      }
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      return true;
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
