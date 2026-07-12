import React, { useCallback, useMemo, useState } from "react";
import { UNIVERSITIES as BASE_UNIVERSITIES } from "../data/universities";
import { DIRECTORY as BASE_DIRECTORY } from "../data/directory";
import { MAJORS as BASE_MAJORS } from "../data/majors";
import { FAQS as BASE_FAQS } from "../data/faqs";
import { loadOverride, saveOverride, clearOverride } from "./storage";
import { DataContext } from "./useData";

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ensureIds(list, prefix) {
  return list.map((item) => (item.id ? item : { ...item, id: makeId(prefix) }));
}

function useCollection(key, base, prefix) {
  const [items, setItems] = useState(() => loadOverride(key, null) || ensureIds(base, prefix));

  // Returns whether the write actually made it to localStorage (see
  // saveOverride) so callers can warn the user if e.g. an uploaded image
  // pushed a record past the browser's storage quota.
  const persist = useCallback(
    (updater) => {
      let ok = true;
      setItems((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        ok = saveOverride(key, next);
        return next;
      });
      return ok;
    },
    [key]
  );

  const reset = useCallback(() => {
    clearOverride(key);
    setItems(ensureIds(base, prefix));
  }, [key, base, prefix]);

  return [items, persist, reset];
}

export function DataProvider({ children }) {
  const [universities, setUniversities, resetUniversities] = useCollection("universities", BASE_UNIVERSITIES, "uni");
  const [directory, setDirectory, resetDirectory] = useCollection("directory", BASE_DIRECTORY, "dir");
  const [majors, setMajors, resetMajors] = useCollection("majors", BASE_MAJORS, "major");
  const [faqs, setFaqs, resetFaqs] = useCollection("faqs", BASE_FAQS, "faq");

  const value = {
    universities,
    directory,
    majors,
    faqs,

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

    addUniversity: (u) => setUniversities((prev) => [...prev, u]),
    updateUniversity: (id, patch) => setUniversities((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u))),
    removeUniversity: (id) => setUniversities((prev) => prev.filter((u) => u.id !== id)),
    resetUniversities,
    restoreUniversities: (list) => setUniversities(ensureIds(list, "uni")),

    addDirectoryEntry: (u) => setDirectory((prev) => [...prev, u]),
    updateDirectoryEntry: (id, patch) => setDirectory((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u))),
    removeDirectoryEntry: (id) => setDirectory((prev) => prev.filter((u) => u.id !== id)),
    resetDirectory,
    restoreDirectory: (list) => setDirectory(ensureIds(list, "dir")),

    addMajor: (m) => setMajors((prev) => [...prev, { ...m, id: makeId("major") }]),
    updateMajor: (id, patch) => setMajors((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))),
    removeMajor: (id) => setMajors((prev) => prev.filter((m) => m.id !== id)),
    resetMajors,
    restoreMajors: (list) => setMajors(ensureIds(list, "major")),

    addFaq: (f) => setFaqs((prev) => [...prev, { ...f, id: makeId("faq") }]),
    updateFaq: (id, patch) => setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f))),
    removeFaq: (id) => setFaqs((prev) => prev.filter((f) => f.id !== id)),
    resetFaqs,
    restoreFaqs: (list) => setFaqs(ensureIds(list, "faq")),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
