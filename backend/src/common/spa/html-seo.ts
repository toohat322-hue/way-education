import type { PageSeo } from "./seo-routes";

const SITE_ORIGIN = "https://wayeducation.com";
const DEFAULT_TITLE = "Way Education — Study in Türkiye & Northern Cyprus";
const DEFAULT_DESCRIPTION =
  "Way Education — university admissions for MENA students in Türkiye & Northern Cyprus.";
const DEFAULT_OG_DESCRIPTION =
  "Way Education helps MENA students apply, get admitted, and relocate to top universities in Türkiye and Northern Cyprus.";
const DEFAULT_TWITTER_DESCRIPTION =
  "Apply to accredited universities with end-to-end guidance from application to visa.";
const DEFAULT_CANONICAL = `${SITE_ORIGIN}/`;
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
const DEFAULT_ROBOTS = "index, follow";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Rewrites the built index.html's default title/description/canonical/OG/
 * Twitter tags with route-specific values, so crawlers (including ones that
 * never run JS, like link-preview bots) see correct per-page metadata on
 * the very first response instead of the same site-wide defaults everywhere.
 */
export function injectSeo(indexHtml: string, seo: PageSeo, image?: string): string {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = `${SITE_ORIGIN}${seo.path}`;
  const imageUrl = image || DEFAULT_IMAGE;
  const robots = seo.robots || DEFAULT_ROBOTS;

  let html = indexHtml;
  html = html.replace(`<title>${DEFAULT_TITLE}</title>`, `<title>${title}</title>`);
  html = html.replaceAll(`content="${DEFAULT_TITLE}"`, `content="${title}"`);
  html = html.replace(`content="${DEFAULT_DESCRIPTION}"`, `content="${description}"`);
  html = html.replace(`content="${DEFAULT_OG_DESCRIPTION}"`, `content="${description}"`);
  html = html.replace(`content="${DEFAULT_TWITTER_DESCRIPTION}"`, `content="${description}"`);
  html = html.replace(`href="${DEFAULT_CANONICAL}"`, `href="${canonical}"`);
  html = html.replace(`content="${DEFAULT_CANONICAL}"`, `content="${canonical}"`);
  html = html.replaceAll(`content="${DEFAULT_IMAGE}"`, `content="${escapeHtml(imageUrl)}"`);
  html = html.replace(
    `<meta name="robots" content="${DEFAULT_ROBOTS}" />`,
    `<meta name="robots" content="${robots}" />`,
  );
  return html;
}
