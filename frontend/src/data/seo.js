// Keep this in sync with backend/src/common/spa/seo-routes.ts -- the backend
// injects these same values into the raw HTML on first load (for crawlers),
// this copy re-applies title/description on client-side route changes so the
// browser tab and history entries stay correct during in-app navigation.
export const PAGE_SEO = {
  "/": {
    title: "Way Education — Study in Türkiye & Northern Cyprus",
    description:
      "Way Education helps MENA students apply, get admitted, and relocate to top universities in Türkiye and Northern Cyprus.",
  },
  "/universities": {
    title: "Partner Universities in Türkiye & Northern Cyprus | Way Education",
    description:
      "Browse accredited partner universities in Türkiye and Northern Cyprus. Compare tuition, scholarships, and programs with Way Education.",
  },
  "/about": {
    title: "About Us | Way Education",
    description:
      "Way Education guides MENA students end-to-end, from university applications to visas and relocation in Türkiye and Northern Cyprus.",
  },
  "/contact": {
    title: "Contact Us | Way Education",
    description:
      "Get in touch with Way Education for free guidance on university admissions, scholarships, and visas in Türkiye and Northern Cyprus.",
  },
};
