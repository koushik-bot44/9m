import type { NextConfig } from "next";

// Everything the site loads comes from this origin, except the Google Maps embed and the links out to WhatsApp,
// Instagram and Google. These headers lock down what a browser will do with the pages.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

// Photos, films and the logo are renamed when they change, so browsers can keep them for a month.
const LONG_CACHE = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // CSS stays a separate, cacheable file: inlining it put three copies of the stylesheet in every page's HTML.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    minimumCacheTTL: 2592000,
  },
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/media/:path*", headers: LONG_CACHE },
      { source: "/logo-9m.jpg", headers: LONG_CACHE },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
