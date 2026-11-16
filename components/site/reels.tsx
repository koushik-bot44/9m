"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { DEFAULT_REELS, SITE, type Reel } from "@/lib/site";
import { Pill } from "./pill";

/** Vertical reels in a row. The page holds here and your scroll moves the row sideways, reel by reel;
 *  once the last reel is in, the page carries on. Each reel plays, muted, while it is on screen.
 *  Reels uploaded in /admin come first. */
export function Reels() {
  const [list, setList] = useState<Reel[]>(DEFAULT_REELS);
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const travel = useRef(0); // how far the row has to move: its width less the screen's
  const [hold, setHold] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    let live = true;
    fetch("/api/reels")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: unknown) => {
        if (live && Array.isArray(rows) && rows.length) setList([...(rows as Reel[]), ...DEFAULT_REELS]);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => x.set(-p * travel.current));

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      travel.current = Math.max(0, t.scrollWidth - window.innerWidth);
      setHold(travel.current);
      x.set(-scrollYProgress.get() * travel.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list.length, scrollYProgress, x]);

  return (
    // one pixel of scroll moves the row one pixel, so the hold is exactly as long as the row needs
    <section id="reels" ref={wrap} className="relative" style={{ height: `calc(100svh + ${hold}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[clamp(44px,7svh,72px)] max-md:pb-[74px]">
        <div className="gut flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[clamp(2.2rem,5vw,5rem)]">
              Reels from the <em>bay.</em>
            </h2>
            <p className="mt-3 max-w-xl text-[clamp(1rem,1.3vw,1.2rem)] leading-snug text-muted-foreground">
              Short clips of the work, the way it goes up on Instagram. Keep scrolling to move through them.
            </p>
          </div>
          <Pill href={SITE.instagram} external tone="line" className="max-md:hidden">
            Follow {SITE.instagramHandle}
          </Pill>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-[clamp(20px,3.4svh,44px)] flex w-max gap-[clamp(10px,1.2vw,18px)] px-[var(--gut)]">
          {list.map((r) => (
            <ReelCard key={r.id} reel={r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReelCard({ reel }: { reel: Reel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const stopped = useRef(false); // the visitor paused this one

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.6 && !stopped.current) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      stopped.current = false;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      stopped.current = true;
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="group relative aspect-[9/16] h-[min(58svh,520px)] shrink-0 overflow-hidden rounded-[14px] bg-[#111] max-md:h-[min(56svh,440px)]">
      <video
        ref={video}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload={reel.poster ? "none" : "metadata"}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[0.98rem] leading-snug font-semibold text-white">{reel.title}</figcaption>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${reel.title}` : `Play ${reel.title}`}
        className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/45 text-white transition-opacity focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </figure>
  );
}
