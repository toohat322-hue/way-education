export interface PageSeo {
  title: string;
  description: string;
  path: string;
  robots?: string;
}

// Keep this in sync with frontend/src/data/seo.js -- the backend injects
// these values into the raw HTML (for crawlers and first load), the
// frontend hook re-applies title/description on client-side navigation.
export const STATIC_ROUTE_SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title: "Way Education — Study in Türkiye & Northern Cyprus",
    description:
      "Way Education helps MENA students apply, get admitted, and relocate to top universities in Türkiye and Northern Cyprus.",
  },
  "/universities": {
    path: "/universities",
    title: "Partner Universities in Türkiye & Northern Cyprus | Way Education",
    description:
      "Browse accredited partner universities in Türkiye and Northern Cyprus. Compare tuition, scholarships, and programs with Way Education.",
  },
  "/about": {
    path: "/about",
    title: "About Us | Way Education",
    description:
      "Way Education guides MENA students end-to-end, from university applications to visas and relocation in Türkiye and Northern Cyprus.",
  },
  "/contact": {
    path: "/contact",
    title: "Contact Us | Way Education",
    description:
      "Get in touch with Way Education for free guidance on university admissions, scholarships, and visas in Türkiye and Northern Cyprus.",
  },
};

export const NOT_FOUND_SEO: PageSeo = {
  path: "/",
  title: "Page Not Found | Way Education",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: "noindex, follow",
};

export const ADMIN_SEO: PageSeo = {
  path: "/admin",
  title: "Admin | Way Education",
  description: "Way Education admin dashboard.",
  robots: "noindex, nofollow",
};
