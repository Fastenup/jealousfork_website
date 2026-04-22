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
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/food/oreo-chocolate-chip.jpg`;
const BURGER_OG_IMAGE = `${SITE_ORIGIN}/images/food/jesse-james-burger.jpg`;
const BREAKFAST_OG_IMAGE = `${SITE_ORIGIN}/images/food/peanut-butter-maple.jpg`;

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
      title: "Breakfast Near Me & Pancakes Near Me in Kendall | Jealous Fork",
      description:
        "Looking for breakfast near me, pancakes near me, or brunch near me in Kendall? Jealous Fork serves 400+ reviewed favorites with fast pickup and easy reservations.",
      canonical: makeCanonical(pathname),
      keywords:
        "best pancakes in miami, pancakes near me, breakfast near me, brunch near me, breakfast kendall, brunch kendall, best breakfast kendall, best pancakes miami, artisan pancakes Miami, breakfast miami, brunch miami, gourmet burgers Miami, Jealous Fork",
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
    "/breakfast-near-me": {
      title: "Pancakes Near Me in Kendall | Best Brunch Kendall",
      description:
        "Searching pancakes near me or best brunch Kendall? Jealous Fork serves 4.7★ pancakes, eggs benedict, and brunch favorites. Check hours, photos, and order now.",
      canonical: makeCanonical(pathname),
      keywords:
        "breakfast near me, pancakes near me, best brunch Kendall, breakfast Kendall, breakfast Miami, brunch near me, Jealous Fork",
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

  return routeMap[pathname] || routeMap["/"];
}

export function isNoindexRoute(url: string): boolean {
  return getRouteSeoMeta(url).robots?.includes("noindex") ?? false;
}
