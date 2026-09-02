import { localAreas } from "../client/src/data/localAreas";

export interface RouteSeoMeta {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  robots?: string;
  ogImage?: string;
}

const SITE_ORIGIN = "https://www.jealousfork.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/og/jealous-fork-og.jpg`;
const BURGER_OG_IMAGE = DEFAULT_OG_IMAGE;
const BREAKFAST_OG_IMAGE = DEFAULT_OG_IMAGE;

function normalizePath(url: string): string {
  const pathOnly = url.split("?")[0].split("#")[0] || "/";
  return pathOnly === "/" ? "/" : pathOnly.replace(/\/+$/, "");
}

function makeCanonical(pathname: string): string {
  return `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
}

function buildAreaMeta(pathname: string): RouteSeoMeta | null {
  const areaSlug = pathname.replace(/^\/near\//, "");
  const area = localAreas.find((entry) => entry.slug === areaSlug);

  if (!area) return null;

  const title =
    area.seoTitle ||
    `Breakfast Near ${area.name} | Jealous Fork Kendall Brunch`;

  const description =
    area.seoDescription ||
    `Looking for breakfast near ${area.name}? Jealous Fork serves artisan pancakes, brunch favorites, pickup, and reservations from our Kendall location${area.distance ? `, about ${area.distance} away` : ""}.`;

  return {
    title,
    description,
    canonical: makeCanonical(pathname),
    keywords: `breakfast near ${area.name.toLowerCase()}, brunch near ${area.name.toLowerCase()}, pancakes near ${area.name.toLowerCase()}, jealous fork ${area.name.toLowerCase()}, breakfast miami`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogImage: BREAKFAST_OG_IMAGE,
  };
}

export function getRouteSeoMeta(url: string): RouteSeoMeta {
  const pathname = normalizePath(url);

  if (pathname.startsWith("/near/")) {
    const areaMeta = buildAreaMeta(pathname);
    if (areaMeta) return areaMeta;
  }

  const routeMap: Record<string, RouteSeoMeta> = {
    "/": {
      title: "Breakfast Near Me Kendall + Best Pancakes Miami | Jealous Fork",
      description:
        "Searching breakfast near me, breakfast Kendall, or best pancakes Miami? Jealous Fork serves 4.7★ artisan pancakes, brunch, pickup, and reservations in Kendall.",
      canonical: makeCanonical(pathname),
      keywords:
        "best pancakes in miami, best pancakes miami, pancakes near me, breakfast near me, breakfast kendall, brunch kendall, best breakfast kendall, brunch near me, artisan pancakes Miami, breakfast miami, brunch miami, gourmet burgers Miami, Jealous Fork",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/full-menu": {
      title: "Menu — Best Pancakes & Breakfast in Miami | Jealous Fork Kendall",
      description:
        "See our full menu: artisan pancakes, gourmet burgers, flatbreads, brunch favorites, and drinks. Order online for pickup or delivery from Jealous Fork in Kendall.",
      canonical: makeCanonical(pathname),
      keywords:
        "Jealous Fork menu, best pancakes Miami menu, breakfast menu Kendall, order breakfast online Miami, brunch menu Kendall, gourmet burgers menu Miami",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/menu": {
      title: "Menu — Best Pancakes & Breakfast in Miami | Jealous Fork Kendall",
      description:
        "See our full menu: artisan pancakes, gourmet burgers, flatbreads, brunch favorites, and drinks. Order online for pickup or delivery from Jealous Fork in Kendall.",
      canonical: `${SITE_ORIGIN}/full-menu`,
      keywords:
        "Jealous Fork menu, best pancakes Miami menu, breakfast menu Kendall, order breakfast online Miami, brunch menu Kendall, gourmet burgers menu Miami",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: DEFAULT_OG_IMAGE,
    },

    "/menu.html": {
      title: "Jealous Fork Menu: Pancakes, Brunch & Burgers",
      description:
        "See the Jealous Fork menu for pancakes, brunch plates, gourmet burgers, pickup, delivery, and Kendall reservations.",
      canonical: `${SITE_ORIGIN}/full-menu`,
      keywords:
        "Jealous Fork menu, Jealous Fork pancakes, breakfast menu Kendall, brunch menu Kendall, gourmet burgers Miami",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/gallery": {
      title: "Jealous Fork Photos: Pancakes & Brunch in Kendall",
      description:
        "See Jealous Fork photos of 4.7★ pancakes, brunch plates, burgers, and the Kendall Miami restaurant before you order pickup, delivery, or reserve.",
      canonical: makeCanonical(pathname),
      keywords:
        "Jealous Fork photos, Jealous Fork gallery, pancakes photos Miami, brunch photos Kendall, Jealous Fork menu photos",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/breakfast-near-me": {
      title: "Breakfast Near Me Kendall + Best Pancakes Miami | Jealous Fork",
      description:
        "Searching breakfast near me, breakfast Kendall, or best pancakes Miami? Jealous Fork serves 4.7★ artisan pancakes, eggs benedict, pickup, and brunch reservations.",
      canonical: makeCanonical(pathname),
      keywords:
        "breakfast near me, breakfast Kendall, pancakes near me, best pancakes Miami, best brunch Kendall, breakfast Miami, brunch near me, Jealous Fork",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: BREAKFAST_OG_IMAGE,
    },
    "/burgers": {
      title: "Best Gourmet Burgers in Kendall & Miami FL | Jealous Burger | Fri-Sat 3PM-9PM",
      description:
        "Order gourmet burgers from Jealous Burger in Kendall. Friday and Saturday only, 3PM-9PM, with pickup, delivery, and fan-favorite burgers like Jesse James and Que Bola Meng.",
      canonical: makeCanonical(pathname),
      keywords:
        "best burgers Kendall, gourmet burgers Miami, Jealous Burger, burger delivery Kendall, burger pickup Miami, Jesse James burger",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: BURGER_OG_IMAGE,
    },
    "/best-affordable-burgers-miami": {
      title: "Best Affordable Burgers in Miami | Jealous Burger Kendall",
      description:
        "Gourmet burgers in Miami without the gourmet price. Jealous Burger serves Kendall Friday and Saturday from 3 PM with pickup and delivery.",
      canonical: makeCanonical(pathname),
      keywords:
        "affordable burgers Miami, cheap burgers Kendall, best burgers Miami, Jealous Burger, burger deals Miami",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ogImage: BURGER_OG_IMAGE,
    },
    "/privacy": {
      title: "Privacy Policy | Jealous Fork Miami",
      description:
        "Privacy Policy for Jealous Fork restaurant. Learn how we protect your personal information and data when you visit our website or restaurant.",
      canonical: makeCanonical(pathname),
      robots: "noindex, follow",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/terms": {
      title: "Terms of Service | Jealous Fork Miami",
      description:
        "Terms of Service for Jealous Fork restaurant. Read our terms and conditions for dining, reservations, ordering, and website use.",
      canonical: makeCanonical(pathname),
      robots: "noindex, follow",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/checkout": {
      title: "Checkout | Jealous Fork Online Ordering",
      description:
        "Complete your Jealous Fork pickup or delivery order securely online.",
      canonical: makeCanonical(pathname),
      robots: "noindex, nofollow, noarchive",
      ogImage: DEFAULT_OG_IMAGE,
    },
    "/admin": {
      title: "Admin | Jealous Fork",
      description: "Administrative tools for Jealous Fork website management.",
      canonical: makeCanonical(pathname),
      robots: "noindex, nofollow, noarchive",
      ogImage: DEFAULT_OG_IMAGE,
    },
  };

  if (pathname.startsWith("/order-confirmation/")) {
    return {
      title: "Order Confirmation | Jealous Fork",
      description: "Order confirmation for your Jealous Fork purchase.",
      canonical: makeCanonical(pathname),
      robots: "noindex, nofollow, noarchive",
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  if (pathname.startsWith("/menu/")) {
    return routeMap["/menu"];
  }

  if (pathname === "/about") {
    return { ...routeMap["/"], canonical: `${SITE_ORIGIN}/` };
  }

  if (routeMap[pathname]) {
    return routeMap[pathname];
  }

  // Unknown route: real 404 meta so soft-404s stop carrying homepage meta.
  return {
    title: "Page Not Found | Jealous Fork",
    description:
      "That page does not exist. Visit Jealous Fork in Kendall, Miami for artisan pancakes, brunch, and gourmet burgers.",
    canonical: `${SITE_ORIGIN}/`,
    robots: "noindex, follow",
    ogImage: DEFAULT_OG_IMAGE,
  };
}

const KNOWN_EXACT_ROUTES = new Set([
  "/",
  "/full-menu",
  "/menu",
  "/menu.html",
  "/gallery",
  "/breakfast-near-me",
  "/burgers",
  "/best-affordable-burgers-miami",
  "/privacy",
  "/terms",
  "/checkout",
  "/admin",
  "/about",
]);

/** True when the path maps to a real page (SPA route). Unknown paths get HTTP 404. */
export function isKnownRoute(url: string): boolean {
  const pathname = normalizePath(url);
  if (KNOWN_EXACT_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/order-confirmation/")) return true;
  if (pathname.startsWith("/menu/")) return true;
  if (pathname.startsWith("/near/")) {
    const slug = pathname.replace(/^\/near\//, "");
    return localAreas.some((entry) => entry.slug === slug);
  }
  return false;
}

export function isNoindexRoute(url: string): boolean {
  return getRouteSeoMeta(url).robots?.includes("noindex") ?? false;
}
