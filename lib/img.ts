import { getImageProps } from "next/image";

// Every photo on the site goes through Next's built-in image optimiser (sharp): resized to what the layout needs
// and served as WebP. Widths must be ones next.config.ts allows (device sizes and image sizes), and qualities must be
// in its `qualities` list.
type Width = 384 | 640 | 828 | 1080 | 1200 | 1920;
type Quality = 60 | 70 | 75;

/** URL of an optimised copy of a local photo. Anything outside /media (e.g. admin uploads) is returned as is. */
export function opt(src: string, w: Width, q: Quality = 70) {
  if (!src.startsWith("/media/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}

/** Props for a responsive <img> that fills its positioned parent: srcset, sizes, lazy loading, async decoding. */
export function fillImg(src: string, alt: string, sizes: string, opts: { eager?: boolean; q?: Quality } = {}) {
  const { props } = getImageProps({
    src,
    alt,
    fill: true,
    sizes,
    quality: opts.q ?? 70,
    loading: opts.eager ? "eager" : "lazy",
    ...(opts.eager ? { fetchPriority: "high" as const } : {}),
  });
  return props;
}
