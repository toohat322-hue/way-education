import { useEffect } from "react";

const SITE_ORIGIN = "https://wayeducation.com";

// Keeps the tab title, meta description, and canonical link in sync on
// client-side route changes. The initial HTML for each route already has
// the right values baked in server-side (see backend/src/common/spa) --
// this only matters for in-app navigation, which never re-requests the HTML.
export function useDocumentMeta({ title, description, path }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute("content", description);
    }
    if (path) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", `${SITE_ORIGIN}${path}`);
    }
  }, [title, description, path]);
}
