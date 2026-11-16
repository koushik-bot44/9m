"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { DEFAULT_REELS, SITE, type Reel } from "@/lib/site";
import { Pill } from "./pill";

/** Vertical reels in a swipeable row. Each plays, muted, once most of it is on screen.
 *  Reels uploaded in /admin come first. */
export function Reels() {
  const [list, setList] = useState<Reel[]>(DEFAULT_REELS);

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

  return (
    <section id="reels" className="py-[clamp(72px,10vw,150px)]">
      <div className="gut flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="display text-[clamp(2.4rem,6vw,5.8rem)]">
            Reels from the <em>bay.</em>
          </h2>
          <p className="mt-4 max-w-xl text-[clamp(1.05rem,1.4vw,1.3rem)] leading-snug text-muted-foreground">
            Short clips of the work, the way it goes up on Instagram. Swipe through; each one plays as it comes into view.
          </p>
        </div>
        <Pill href={SITE.instagram} external tone="line">
          Follow {SITE.instagramHandle}
        </Pill>
      </div>
      <div className="mt-[clamp(28px,4vw,56px)] flex snap-x snap-mandatory scroll-px-[var(--gut)] gap-[clamp(10px,1.2vw,18px)] overflow-x-auto px-[var(--gut)] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((r) => (
          <ReelCard key={r.id} reel={r} />
        ))}
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
    <figure className="group relative aspect-[9/16] w-[clamp(210px,19vw,290px)] shrink-0 snap-start overflow-hidden rounded-[14px] bg-[#111]">
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
