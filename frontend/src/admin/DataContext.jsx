import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UNIVERSITIES as BASE_UNIVERSITIES } from "../data/universities";
import { DIRECTORY as BASE_DIRECTORY } from "../data/directory";
import { MAJORS as BASE_MAJORS } from "../data/majors";
import { FAQS as BASE_FAQS } from "../data/faqs";
import { SETTINGS as BASE_SETTINGS } from "../data/settings";
import { DataContext } from "./useData";
import { apiFetch } from "../lib/api";

export function DataProvider({ children }) {
  const [universities, setUniversities] = useState(BASE_UNIVERSITIES);
  const [directory, setDirectory] = useState(BASE_DIRECTORY);
  const [majors, setMajors] = useState(BASE_MAJORS.map((major) => ({ ...major, id: major.id || major.name.en.toLowerCase().replace(/\s+/g, "-") })));
  const [faqs, setFaqs] = useState(BASE_FAQS.map((faq, index) => ({ ...faq, id: faq.id || `faq-${index + 1}` })));
  const [settings, setSettingsState] = useState(BASE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyBootstrap = useCallback((payload) => {
    if (Array.isArray(payload?.universities)) setUniversities(payload.universities);
    if (Array.isArray(payload?.directory)) setDirectory(payload.directory);
    if (Array.isArray(payload?.majors)) setMajors(payload.majors);
    if (Array.isArray(payload?.faqs)) setFaqs(payload.faqs);
    if (payload?.settings?.whatsapp) setSettingsState((prev) => ({ ...prev, ...payload.settings }));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await apiFetch("/api/cms/bootstrap");
      applyBootstrap(payload);
    } catch (err) {
      setError(err.message || "Failed to load CMS data");
    } finally {
      setLoading(false);
    }
  }, [applyBootstrap]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = useCallback(async (patch) => {
    const next = await apiFetch("/api/cms/settings", {
      method: "PATCH",
      body: JSON.stringify({
        whatsapp: patch.whatsapp,
        websiteName: patch.websiteName,
        supportEmail: patch.supportEmail,
        supportPhone: patch.supportPhone,
      }),
    });
    setSettingsState((prev) => ({ ...prev, ...next }));
    return next;
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
    updateSettings,

    getUniversityById: useCallback((id) => universities.find((u) => u.id === id), [universities]),

    // Public-facing views (Hero picks, PopularUniversities, the /universities
    // directory) should read from this instead of the raw `universities` list:
    // it hides anything toggled "Inactive" and pushes "Featured" picks first
    // (a stable sort, so ties keep their original order). The admin dashboard
    // intentionally keeps using the raw `universities` list so inactive
    // entries stay manageable there.
    publicUniversities: useMemo(
      () =>
        universities
          .filter((u) => u.active !== false)
          .slice()
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
      [universities]
    ),

    addUniversity: async (u) => {
      const created = await apiFetch("/api/cms/universities", { method: "POST", body: JSON.stringify(u) });
      setUniversities((prev) => [created, ...prev]);
      return created;
    },
    updateUniversity: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/universities/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setUniversities((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    },
    removeUniversity: async (id) => {
      await apiFetch(`/api/cms/universities/${id}`, { method: "DELETE" });
      setUniversities((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addDirectoryEntry: async (u) => {
      const created = await apiFetch("/api/cms/directory", { method: "POST", body: JSON.stringify(u) });
      setDirectory((prev) => [created, ...prev]);
      return created;
    },
    updateDirectoryEntry: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/directory/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setDirectory((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    },
    removeDirectoryEntry: async (id) => {
      await apiFetch(`/api/cms/directory/${id}`, { method: "DELETE" });
      setDirectory((prev) => prev.filter((u) => u.id !== id));
      return true;
    },

    addMajor: async (m) => {
      const created = await apiFetch("/api/cms/majors", { method: "POST", body: JSON.stringify(m) });
      setMajors((prev) => [...prev, created]);
      return created;
    },
    updateMajor: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/majors/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setMajors((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    },
    removeMajor: async (id) => {
      await apiFetch(`/api/cms/majors/${id}`, { method: "DELETE" });
      setMajors((prev) => prev.filter((m) => m.id !== id));
      return true;
    },

    addFaq: async (f) => {
      const created = await apiFetch("/api/cms/faqs", { method: "POST", body: JSON.stringify(f) });
      setFaqs((prev) => [...prev, created]);
      return created;
    },
    updateFaq: async (id, patch) => {
      const updated = await apiFetch(`/api/cms/faqs/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setFaqs((prev) => prev.map((f) => (f.id === id ? updated : f)));
      return updated;
    },
    removeFaq: async (id) => {
      await apiFetch(`/api/cms/faqs/${id}`, { method: "DELETE" });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      return true;
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
