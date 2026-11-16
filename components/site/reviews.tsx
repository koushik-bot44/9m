"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS, SITE, type Review } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Pill } from "./pill";

// Where each owner signed: across the bottom of the photo and onto the white of the print.
const SIGN = ["left-[7%] -rotate-[8deg]", "left-[20%] -rotate-[4deg]", "left-[10%] -rotate-[10deg]", "left-[26%] -rotate-[6deg]"];

/** Reviews as signed instant photos of real 9M cars, in a straight row that keeps sliding right to left
 *  and grows as you reach it. The review is written under each photo. Reviews added in /admin come first. */
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

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 12%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["12vh", "0vh"]);
  const list = [...added, ...REVIEWS];
  const loop = [...list, ...list];

  return (
    <section ref={ref} id="reviews" className="overflow-hidden py-[clamp(72px,9vw,140px)]">
      <div className="gut text-center">
        <h2 className="display text-[clamp(2.4rem,5vw,4.8rem)]">
          Owners, in their own <em>words.</em>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[clamp(1rem,1.25vw,1.2rem)] text-muted-foreground">Real cars from the studio, signed by the people who drive them.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Pill href={SITE.googleReview} external size="sm">
            Write a review on Google
          </Pill>
          <Pill href={SITE.maps} external size="sm" tone="line">
            Read them on Google
          </Pill>
        </div>
      </div>

      <motion.div style={{ scale, y }} className="mt-[clamp(32px,4.5vw,64px)] origin-top">
        <div className="marquee py-3" style={{ "--marquee-duration": `${list.length * 8}s` } as CSSProperties}>
          <div className="marquee-track items-start gap-[clamp(18px,1.9vw,30px)] pl-[clamp(18px,1.9vw,30px)]">
            {loop.map((r, i) => {
              const dup = i >= list.length;
              return (
                <figure key={`${r.id}-${i}`} aria-hidden={dup || undefined} className="w-[clamp(250px,22vw,330px)] shrink-0">
                  <div className="relative bg-[#fbfaf7] p-[clamp(10px,0.9vw,14px)] pb-[clamp(48px,4.4vw,64px)] shadow-[0_2px_8px_rgb(0_0_0/0.18)] transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-2">
                    <div className="aspect-[4/5] overflow-hidden bg-[#e6e3dd]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.photo.src} alt={dup ? "" : r.photo.alt} draggable={false} className="size-full object-cover" />
                    </div>
                    <span
                      aria-hidden
                      className={cn("pointer-events-none absolute bottom-[2px] font-hand text-[clamp(2.7rem,3.7vw,3.8rem)] leading-none whitespace-nowrap text-[#121212]", SIGN[i % SIGN.length])}
                    >
                      {r.sign}
                    </span>
                  </div>
                  <figcaption className="mt-4 px-1">
                    <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, k) => (
                        <Star key={k} className={cn("size-4", k < r.rating ? "fill-current" : "opacity-25")} />
                      ))}
                    </div>
                    <blockquote className="mt-2 text-[clamp(0.98rem,1.05vw,1.06rem)] leading-snug font-medium">&ldquo;{r.text}&rdquo;</blockquote>
                    <p className="mt-2.5 text-[0.86rem] font-semibold">
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

      <p className="gut mt-6 text-center text-sm text-muted-foreground">Cars photographed at 9M. Review text is a placeholder until 9M&apos;s Google reviews are added.</p>
    </section>
  );
}
