"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS, SITE, type Review } from "@/lib/site";
import { opt } from "@/lib/img";
import { cn } from "@/lib/utils";
import { Pill } from "./pill";

// Where each owner signed: across the bottom of the photo and onto the white of the print.
const SIGN = ["left-[7%] -rotate-[8deg]", "left-[20%] -rotate-[4deg]", "left-[10%] -rotate-[10deg]", "left-[26%] -rotate-[6deg]"];

/** Reviews as signed instant photos of real 9M cars, in a straight row that keeps sliding right to left.
 *  The page holds here for a couple of scrolls while the row grows in and drifts. Reviews added in /admin come first. */
export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [added, setAdded] = useState<Review[]>([]);

  useEffect(() => {
    let live = true;
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: unknown) => {
        if (live && Array.isArray(rows)) setAdded(rows as Review[]);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  // the hold: while the page is pinned here, the row grows to full size, then drifts on with the scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [0.8, 1]);
  const rowX = useTransform(scrollYProgress, [0, 1], ["8vw", "-18vw"]);
  const headY = useTransform(scrollYProgress, [0, 0.55], ["5svh", "0svh"]);

  const list = [...added, ...REVIEWS];
  const loop = [...list, ...list];

  return (
    <section ref={ref} id="reviews" className="relative h-[230svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[clamp(44px,7svh,72px)] max-md:pt-[50px] max-md:pb-[74px]">
        <motion.div style={{ y: headY }} className="gut text-center">
          <h2 className="display text-[clamp(2.2rem,4.3vw,4.2rem)]">
            Owners, in their own <em>words.</em>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[clamp(0.98rem,1.15vw,1.12rem)] text-muted-foreground [@media(max-height:760px)]:hidden">Real cars from the studio, signed by the people who drive them.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Pill href={SITE.googleReview} external size="sm" className="max-md:min-h-9 max-md:px-3.5 max-md:text-[0.82rem]">
              Write a review on Google
            </Pill>
            <Pill href={SITE.maps} external size="sm" tone="line" className="max-md:hidden">
              Read them on Google
            </Pill>
          </div>
        </motion.div>

        <motion.div style={{ scale, x: rowX }} className="mt-[clamp(18px,3.4svh,44px)] origin-center">
          <div className="marquee py-2" style={{ "--marquee-duration": `${list.length * 8}s` } as CSSProperties}>
            <div className="marquee-track items-start gap-[clamp(16px,1.7vw,28px)] pl-[clamp(16px,1.7vw,28px)]">
              {loop.map((r, i) => {
                const dup = i >= list.length;
                return (
                  <figure key={`${r.id}-${i}`} aria-hidden={dup || undefined} className="w-[clamp(168px,18vw,290px)] shrink-0">
                    <div className="relative bg-[#fbfaf7] p-[clamp(9px,0.85vw,13px)] pb-[clamp(44px,4vw,58px)] shadow-[0_2px_8px_rgb(0_0_0/0.18)] transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-2">
                      <div className="aspect-[4/5] overflow-hidden bg-[#e6e3dd]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt(r.photo.src, 640, 75)} alt={dup ? "" : r.photo.alt} width={480} height={600} loading="lazy" decoding="async" draggable={false} className="size-full object-cover" />
                      </div>
                      <span
                        aria-hidden
                        className={cn("pointer-events-none absolute bottom-[2px] font-hand text-[clamp(2.5rem,3.4vw,3.5rem)] leading-none whitespace-nowrap text-[#121212]", SIGN[i % SIGN.length])}
                      >
                        {r.sign}
                      </span>
                    </div>
                    <figcaption className="mt-3 px-1">
                      <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, k) => (
                          <Star key={k} className={cn("size-3.5", k < r.rating ? "fill-current" : "opacity-25")} />
                        ))}
                      </div>
                      <blockquote className="mt-1.5 text-[clamp(0.9rem,0.98vw,1rem)] leading-snug font-medium">&ldquo;{r.text}&rdquo;</blockquote>
                      <p className="mt-2 text-[0.8rem] font-semibold">
                        {r.name}
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          · {r.car} · {r.service}
                        </span>
                      </p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </motion.div>

        <p className="gut mt-3 text-center text-xs text-muted-foreground max-md:hidden [@media(max-height:760px)]:hidden">Cars photographed at 9M. Review text is a placeholder until 9M&apos;s Google reviews are added.</p>
      </div>
    </section>
  );
}
