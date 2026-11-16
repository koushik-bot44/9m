"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FILMS as REELS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A full-screen car film with a huge wordmark over it and a strip of reels to switch between. */
export function Film() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [reel, setReel] = useState(0);
  const inView = useInView(wrap, { amount: 0.2 });

  // the frame arrives as a rounded card and grows to fill the screen as you scroll into it
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.8, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [28, 0]);
  const wordY = useTransform(scrollYProgress, [0.25, 0.75], ["34%", "0%"]);
  const wordOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reel]);

  return (
    <section id="film" ref={wrap} className="relative h-[200svh]" aria-label="Film">
      <div className="sticky top-0 h-[100svh] min-h-[520px] overflow-hidden">
        <motion.div style={{ scale, borderRadius: radius }} className="absolute inset-0 overflow-hidden bg-[#0e0e0f] text-[#f7f3ec]">
          <video
            ref={video}
            key={REELS[reel].src}
            src={REELS[reel].src}
            poster={REELS[reel].poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/75" />

          <motion.div style={{ y: wordY, opacity: wordOpacity }} className="gut absolute inset-x-0 top-1/2 -translate-y-[58%] text-center">
            <p className="display text-[clamp(3.4rem,15.5vw,16rem)] leading-[0.82] italic">
              Finish <em>first.</em>
            </p>
            <p className="mx-auto mt-5 max-w-md text-[clamp(0.95rem,1.2vw,1.15rem)] leading-snug opacity-90">Then drive it like you just collected it. Tap a film below to change it.</p>
          </motion.div>

          <div className="absolute inset-x-0 bottom-[clamp(14px,3svh,30px)] flex gap-2.5 overflow-x-auto px-[var(--gut)] [scrollbar-width:none]">
            {REELS.map((r, i) => (
              <button
                key={r.src}
                type="button"
                onClick={() => setReel(i)}
                aria-pressed={reel === i}
                aria-label={`Play the ${r.label} film`}
                className={cn("relative aspect-[16/10] w-[clamp(120px,13vw,200px)] shrink-0 overflow-hidden rounded-[8px] opacity-70 transition-opacity hover:opacity-100", reel === i && "opacity-100 ring-2 ring-[#f7f3ec]")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-1.5 left-2 text-xs font-semibold text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">{r.label}</span>
              </button>
            ))}
          </div>
          <p className="absolute top-[clamp(74px,11svh,110px)] right-[var(--gut)] text-xs font-semibold opacity-80">Sample film.</p>
        </motion.div>
      </div>
    </section>
  );
}
