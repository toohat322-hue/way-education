#!/usr/bin/env node
// Runs after `vite build`. The production frontend is a static Vercel
// deployment (see docs/deployment.md) -- there is no server-side templating
// step for it, so every route would otherwise ship the same title/
// description/canonical/OG tags baked into dist/index.html.
//
// This writes a prerendered dist/<route>/index.html per known route (static
// pages, plus one per published university fetched from the live API) with
// route-specific metadata, and a real dist/sitemap.xml. Vercel's static
// file resolution serves these directly for their path, ahead of the SPA
// catch-all rewrite in vercel.json, so crawlers (including ones that never
// run JS, like link-preview bots) see correct metadata on the raw HTML --
// while real visitors still get the exact same interactive SPA bundle,
// since these files are the built index.html with only the <head> tags
// swapped.
//
// Never fails the build: if the API is unreachable (e.g. in CI, or a Docker
// build with no network to a live backend), static routes still get
// prerendered and the sitemap still ships with the static pages -- only the
// per-university pages/sitemap entries are skipped, with a warning.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGE_SEO } from "../src/data/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const SITE_ORIGIN = "https://wayeducation.com";

// Must match the literal defaults in frontend/index.html exactly -- these
// are searched-and-replaced in the built HTML, not templated.
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

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(text, max) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function injectSeo(
  indexHtml,
  { title, description, routePath, image, robots },
) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const canonical = `${SITE_ORIGIN}${routePath}`;
  const imageUrl = image || DEFAULT_IMAGE;
  const robotsValue = robots || DEFAULT_ROBOTS;

  let html = indexHtml;
  html = html.replace(
    `<title>${DEFAULT_TITLE}</title>`,
    `<title>${safeTitle}</title>`,
  );
  html = html.replaceAll(
    `content="${DEFAULT_TITLE}"`,
    `content="${safeTitle}"`,
  );
  html = html.replace(
    `content="${DEFAULT_DESCRIPTION}"`,
    `content="${safeDescription}"`,
  );
  html = html.replace(
    `content="${DEFAULT_OG_DESCRIPTION}"`,
    `content="${safeDescription}"`,
  );
  html = html.replace(
    `content="${DEFAULT_TWITTER_DESCRIPTION}"`,
    `content="${safeDescription}"`,
  );
  html = html.replace(`href="${DEFAULT_CANONICAL}"`, `href="${canonical}"`);
  html = html.replace(
    `content="${DEFAULT_CANONICAL}"`,
    `content="${canonical}"`,
  );
  html = html.replaceAll(
    `content="${DEFAULT_IMAGE}"`,
    `content="${escapeHtml(imageUrl)}"`,
  );
  html = html.replace(
    `<meta name="robots" content="${DEFAULT_ROBOTS}" />`,
    `<meta name="robots" content="${robotsValue}" />`,
  );
  return html;
}

async function writeRoute(indexHtml, routePath, seo) {
  const outDir = path.join(distDir, routePath.replace(/^\//, ""));
  await mkdir(outDir, { recursive: true });
  await writeFile(
    path.join(outDir, "index.html"),
    injectSeo(indexHtml, { ...seo, routePath }),
  );
}

function buildSitemap(entries) {
  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${entry.loc}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function fetchPublishedUniversities(apiBase) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${apiBase}/api/cms/bootstrap`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.universities) ? data.universities : [];
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const indexPath = path.join(distDir, "index.html");
  if (!existsSync(indexPath)) {
    console.warn(
      "[generate-seo] dist/index.html not found -- did `vite build` run first? Skipping.",
    );
    return;
  }
  const indexHtml = await readFile(indexPath, "utf8");

  const staticEntries = [
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/universities", changefreq: "daily", priority: "0.9" },
    { loc: "/about", changefreq: "monthly", priority: "0.6" },
    { loc: "/contact", changefreq: "monthly", priority: "0.7" },
  ];

  const staticRoutes = Object.entries(PAGE_SEO).filter(
    ([routePath]) => routePath !== "/",
  );
  for (const [routePath, seo] of staticRoutes) {
    await writeRoute(indexHtml, routePath, seo);
  }
  console.log(
    `[generate-seo] prerendered ${staticRoutes.length} static route(s)`,
  );

  const apiBase = String(process.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/$/, "");
  let universityEntries = [];
  if (apiBase) {
    try {
      const universities = await fetchPublishedUniversities(apiBase);
      for (const uni of universities) {
        if (!uni?.id) continue;
        const description =
          truncate(uni.about?.en, 155) ||
          `${uni.name} in ${uni.city?.en || "Türkiye"} — tuition, scholarships, and admission requirements. Apply with Way Education.`;
        // uni.image can be a data: URI (inline uploads) or a path on a
        // different origin (the media API) -- only trust it as an OG image
        // when it's already an absolute http(s) URL, otherwise fall back to
        // the site default rather than emitting a broken/huge image value.
        const image =
          uni.image && /^https?:\/\//.test(uni.image) ? uni.image : undefined;
        await writeRoute(indexHtml, `/university/${uni.id}`, {
          title: `${uni.name} — Admission, Tuition & Programs | Way Education`,
          description,
          image,
        });
        universityEntries.push({
          loc: `/university/${uni.id}`,
          changefreq: "weekly",
          priority: "0.8",
        });
      }
      console.log(
        `[generate-seo] prerendered ${universities.length} university page(s) from ${apiBase}`,
      );
    } catch (err) {
      console.warn(
        `[generate-seo] could not fetch universities from ${apiBase} (${err.message}); skipping per-university prerendering and sitemap entries`,
      );
    }
  } else {
    console.warn(
      "[generate-seo] VITE_API_BASE_URL not set; skipping per-university prerendering (static pages were still prerendered)",
    );
  }

  await writeFile(
    path.join(distDir, "sitemap.xml"),
    buildSitemap([...staticEntries, ...universityEntries]),
  );
  console.log(
    `[generate-seo] wrote sitemap.xml with ${staticEntries.length + universityEntries.length} entries`,
  );
}

main().catch((err) => {
  console.error(
    "[generate-seo] unexpected error -- leaving dist/ as vite built it:",
    err,
  );
});
