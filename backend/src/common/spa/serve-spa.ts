import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { INestApplication } from "@nestjs/common";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { injectSeo } from "./html-seo";
import { ADMIN_SEO, NOT_FOUND_SEO, STATIC_ROUTE_SEO } from "./seo-routes";

const SITE_ORIGIN = "https://wayeducation.com";
const UNIVERSITY_PATH = /^\/university\/([^/]+)\/?$/;

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function buildSitemapXml(
  entries: { loc: string; changefreq: string; priority: string; lastmod?: string }[],
): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${SITE_ORIGIN}${entry.loc}</loc>${lastmod}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Serves the built frontend (frontend-dist) in production, with a real SPA
 * history fallback so every route (/about, /universities, /university/:id,
 * ...) works on direct load and on refresh, not just client-side navigation.
 *
 * Also rewrites the served index.html's title/description/canonical/OG tags
 * per route, and serves a DB-backed /sitemap.xml, so search engines and
 * link-preview bots see accurate per-page metadata on the raw HTML response.
 *
 * No-ops when frontend-dist isn't present (local dev, where Vite's own dev
 * server already serves the frontend on its own port with its own fallback).
 */
export function registerSpaFallback(app: INestApplication, prisma: PrismaService): void {
  const frontendDist = path.resolve(process.cwd(), "frontend-dist");
  const indexPath = path.join(frontendDist, "index.html");
  if (!existsSync(indexPath)) {
    return;
  }

  const indexHtml = readFileSync(indexPath, "utf8");
  const httpAdapter = app.getHttpAdapter().getInstance();

  httpAdapter.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const universities = await prisma.university.findMany({
        where: { deletedAt: null, active: true, status: "PUBLISHED" },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      });
      const entries = [
        { loc: "/", changefreq: "weekly", priority: "1.0" },
        { loc: "/universities", changefreq: "daily", priority: "0.9" },
        { loc: "/about", changefreq: "monthly", priority: "0.6" },
        { loc: "/contact", changefreq: "monthly", priority: "0.7" },
        ...universities.map((uni) => ({
          loc: `/university/${uni.id}`,
          changefreq: "weekly",
          priority: "0.8",
          lastmod: uni.updatedAt.toISOString().slice(0, 10),
        })),
      ];
      res.type("application/xml").send(buildSitemapXml(entries));
    } catch {
      res.type("application/xml").send(
        buildSitemapXml([
          { loc: "/", changefreq: "weekly", priority: "1.0" },
          { loc: "/universities", changefreq: "daily", priority: "0.9" },
          { loc: "/about", changefreq: "monthly", priority: "0.6" },
          { loc: "/contact", changefreq: "monthly", priority: "0.7" },
        ]),
      );
    }
  });

  // redirect:false stops express.static from 301-ing bare directory paths
  // (e.g. "/universities") to a trailing slash -- that path is also a real
  // SPA route and must fall through to the catch-all below instead.
  app.use(express.static(frontendDist, { index: false, redirect: false }));

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/media")) {
      next();
      return;
    }

    const routePath = req.path.length > 1 ? req.path.replace(/\/+$/, "") : req.path;

    if (routePath.startsWith("/admin")) {
      res.status(200).type("html").send(injectSeo(indexHtml, ADMIN_SEO));
      return;
    }

    const staticSeo = STATIC_ROUTE_SEO[routePath];
    if (staticSeo) {
      res.status(200).type("html").send(injectSeo(indexHtml, staticSeo));
      return;
    }

    const uniMatch = routePath.match(UNIVERSITY_PATH);
    if (uniMatch) {
      const id = uniMatch[1];
      try {
        const uni = await prisma.university.findUnique({
          where: { id },
          include: { city: true },
        });
        if (!uni || uni.deletedAt) {
          res.status(404).type("html").send(injectSeo(indexHtml, NOT_FOUND_SEO));
          return;
        }
        const isPublic = uni.active && uni.status === "PUBLISHED";
        const description =
          truncate(uni.aboutEn, 155) ||
          `${uni.name} in ${uni.city?.nameEn || "Türkiye"} — tuition, scholarships, and admission requirements. Apply with Way Education.`;
        const seo = {
          path: `/university/${uni.id}`,
          title: `${uni.name} — Admission, Tuition & Programs | Way Education`,
          description,
          robots: isPublic ? undefined : "noindex, follow",
        };
        const image = uni.image
          ? uni.image.startsWith("http")
            ? uni.image
            : `${SITE_ORIGIN}${uni.image.startsWith("/") ? "" : "/"}${uni.image}`
          : undefined;
        res.status(200).type("html").send(injectSeo(indexHtml, seo, image));
      } catch {
        res.status(200).type("html").send(indexHtml);
      }
      return;
    }

    res.status(404).type("html").send(injectSeo(indexHtml, NOT_FOUND_SEO));
  });
}
