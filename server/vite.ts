import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { getRouteSeoMeta, isNoindexRoute, isKnownRoute } from "../shared/routeSeo";
import { buildRestaurantJsonLd, RESTAURANT } from "../shared/restaurantSchema";

const viteLogger = createLogger();
const SITE_ORIGIN = "https://www.jealousfork.com";
const FALLBACK_OG_IMAGE = `${SITE_ORIGIN}/images/food/oreo-chocolate-chip.jpg`;

function canonicalPathFromUrl(url: string): string {
  const pathOnly = url.split("?")[0].split("#")[0] || "/";
  return pathOnly === "/" ? "/" : pathOnly.replace(/\/+$/, "");
}

function injectOrReplaceTag(html: string, pattern: RegExp, replacement: string): string {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function injectSeo(html: string, url: string): string {
  const canonicalPath = canonicalPathFromUrl(url);
  const meta = getRouteSeoMeta(canonicalPath);

  let nextHtml = html;

  nextHtml = injectOrReplaceTag(nextHtml, /<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${meta.description}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${meta.keywords || ""}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${meta.robots || "index, follow"}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${meta.canonical}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${meta.title}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${meta.description}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${meta.ogImage || FALLBACK_OG_IMAGE}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${meta.canonical}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${meta.title}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${meta.description}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${meta.ogImage || FALLBACK_OG_IMAGE}" />`);
  nextHtml = injectOrReplaceTag(nextHtml, /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${meta.canonical}" />`);

  // Structured data in the served HTML: Bing/DuckDuckGo (and most AI crawlers)
  // do not reliably execute JS, so client-side JSON-LD is invisible to them.
  if (!meta.robots?.includes("noindex")) {
    nextHtml = nextHtml.replace(
      "</head>",
      `  <script type="application/ld+json">${buildRestaurantJsonLd()}</script>\n</head>`,
    );
  }

  // Crawler-visible page content inside #root. React's createRoot().render()
  // replaces this on mount, so users see the full app; no-JS crawlers see
  // real text (name, address, hours, page copy) instead of an empty shell.
  const h1 = meta.title.split("|")[0].trim();
  const staticShell = [
    `<main style="max-width:720px;margin:40px auto;padding:0 16px;font-family:system-ui,sans-serif">`,
    `<h1>${h1}</h1>`,
    `<p>${meta.description}</p>`,
    `<p><strong>${RESTAURANT.name}</strong> · ${RESTAURANT.street}, ${RESTAURANT.city}, ${RESTAURANT.region} ${RESTAURANT.postalCode} · <a href="tel:${RESTAURANT.phone}">${RESTAURANT.phoneDisplay}</a></p>`,
    `<p>Hours: ${RESTAURANT.hoursText}</p>`,
    `<nav><a href="/">Home</a> · <a href="/full-menu">Full Menu</a> · <a href="/breakfast-near-me">Breakfast Near Me</a> · <a href="/gallery">Gallery</a></nav>`,
    `</main>`,
  ].join("");
  nextHtml = nextHtml.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${staticShell}</div>`,
  );

  return nextHtml;
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      template = injectSeo(template, url);

      const page = await vite.transformIndexHtml(url, template);
      if (isNoindexRoute(url)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
      }
      res.status(isKnownRoute(url) ? 200 : 404).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, the built frontend is in dist/public relative to project root
  // Use process.cwd() which is the project root when running the server
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  app.get("/", async (_req, res, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const html = await fs.promises.readFile(indexPath, "utf-8");
      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .send(injectSeo(html, "/"));
    } catch (error) {
      next(error);
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const html = await fs.promises.readFile(indexPath, "utf-8");
      if (isNoindexRoute(req.originalUrl)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
      }
      // Real 404s for unknown paths: soft-404s kept dead Weebly-era URLs
      // (e.g. /store/p2/...) indexed for years.
      res
        .status(isKnownRoute(req.originalUrl) ? 200 : 404)
        .set({ "Content-Type": "text/html" })
        .send(injectSeo(html, req.originalUrl));
    } catch (error) {
      next(error);
    }
  });
}
