"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { opt } from "@/lib/img";
import { useNear } from "@/lib/near";
import { BAY } from "@/lib/site";
import { cn } from "@/lib/utils";

const REVEAL_MS = 620;

/** Inside the bay, the way Cosmos does it: one tall card in the middle plays a film. The moment it ends, the next
 *  film rises from the bottom edge and covers it, drifting up into place, and the captions change with it. */
export function BayWall() {
  const wrap = useRef<HTMLElement>(null);
  const live = useInView(wrap, { amount: 0.35 });
  const near = useNear(wrap); // nothing downloads until a visitor is getting close
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const curRef = useRef(0);
  const liveRef = useRef(false);
  curRef.current = cur;
  liveRef.current = live;
  const n = BAY.length;

  // the card rises into place and grows as the section scrolls in
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "start start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["24svh", "0svh"]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.76, 1]);

  const next = useCallback(() => {
    const c = curRef.current;
    setPrev(c);
    setCur((c + 1) % n);
  }, [n]);

  // a new film starts from its first frame
  useEffect(() => {
    const v = videos.current[cur];
    if (!v) return;
    v.currentTime = 0;
    if (liveRef.current) v.play().catch(() => {});
  }, [cur]);

  // play only while the section is on screen
  useEffect(() => {
    const v = videos.current[curRef.current];
    if (!v) return;
    if (live) v.play().catch(() => {});
    else v.pause();
  }, [live]);

  // once the new film has covered the old one, the old one stops and steps back
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => {
      videos.current[prev]?.pause();
      setPrev(null);
    }, REVEAL_MS + 60);
    return () => window.clearTimeout(t);
  }, [prev]);

  // if a phone refuses to autoplay, keep the cards changing on posters
  useEffect(() => {
    if (!live) return;
    const t = window.setTimeout(() => {
      const v = videos.current[curRef.current];
      if (!v || v.paused) next();
    }, 7000);
    return () => window.clearTimeout(t);
  }, [cur, live, next]);

  return (
    <section id="bay" ref={wrap} aria-label="Inside the bay" className="relative h-[170svh]">
      <div className="gut sticky top-0 flex h-svh items-center">
        <div className="mx-auto grid w-full max-w-[1480px] items-center gap-[clamp(20px,3.6vw,64px)] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <h2 className="display text-right text-[clamp(2.4rem,5.2vw,5.4rem)] max-md:text-left">
            See what happens in the <em>bay.</em>
          </h2>

          <motion.figure
            style={{ y: cardY, scale: cardScale }}
            className="relative aspect-[2/3] h-[min(72svh,740px,60vw)] overflow-hidden rounded-[10px] bg-[#111] shadow-[0_6px_20px_rgb(0_0_0/0.16)] max-md:h-auto max-md:w-[74vw] max-md:justify-self-center"
          >
            {BAY.map((c, i) => {
              const isCur = i === cur;
              const isPrev = i === prev;
              const entering = isCur && prev !== null;
              return (
                <div key={c.src} className={cn("absolute inset-0 overflow-hidden", isCur ? "z-[2]" : isPrev ? "z-[1]" : "invisible z-0", entering && "bay-in")}>
                  <video
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    src={near ? c.src : undefined}
                    poster={near ? opt(c.poster, 828, 60) : undefined}
                    muted
                    playsInline
                    preload={!near ? "none" : isCur ? "auto" : i === (cur + 1) % n ? "metadata" : "none"}
                    onEnded={() => {
                      if (i === curRef.current) next();
                    }}
                    aria-label={c.alt}
                    className={cn("absolute inset-0 size-full object-cover", entering && "bay-in__media")}
                  />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3.5 py-1.5 text-[0.82rem] font-semibold whitespace-nowrap text-white">
                    9M studio · {c.label}
                  </span>
                </div>
              );
            })}
          </motion.figure>

          <div className="max-w-[22rem] max-md:max-w-none">
            <p key={cur} className="bay-fade text-[clamp(1.02rem,1.3vw,1.2rem)] leading-snug text-muted-foreground">
              {BAY[cur].text}
            </p>
            <p className="mt-4 text-sm font-semibold tabular-nums">
              {cur + 1} / {n} · {BAY[cur].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
