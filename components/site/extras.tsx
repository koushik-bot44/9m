"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { SITE, wa } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Film grain over the whole page, generated once in the browser. */
export function Grain() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 160;
    const x = c.getContext("2d");
    if (!x) return;
    const d = x.createImageData(160, 160);
    let s = 7;
    for (let i = 0; i < d.data.length; i += 4) {
      s = (s * 16807) % 2147483647;
      const v = 90 + (s % 120);
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    x.putImageData(d, 0, 0);
    setUrl(c.toDataURL());
  }, []);
  return url ? <div aria-hidden className="grain" style={{ backgroundImage: `url(${url})` }} /> : null;
}

/** WhatsApp is always one tap away: a round button on desktop, a two-button bar on phones. */
export function Fab() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <a
        href={wa()}
        target="_blank"
        rel="noopener"
        aria-label="Enquire on WhatsApp"
        className={cn(
          "fixed right-5 bottom-5 z-50 hidden size-14 place-items-center rounded-full bg-foreground text-paper shadow-[0_5px_8px_rgb(14_14_15/0.25)] transition-all duration-500 md:grid",
          on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <MessageCircle className="size-6" />
      </a>
      <div className={cn("gut fixed inset-x-0 bottom-0 z-50 flex gap-2 bg-background/95 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] transition-transform duration-500 md:hidden", on ? "translate-y-0" : "translate-y-[120%]")}>
        <a href={wa()} target="_blank" rel="noopener" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-paper">
          <MessageCircle className="size-5" /> WhatsApp
        </a>
        <a href={`tel:${SITE.phones[0].tel}`} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold ring-[1.5px] ring-current ring-inset">
          <Phone className="size-5" /> Call
        </a>
      </div>
    </>
  );
}

/** The very small floating 1954 300 SL. The page holds still while it drives its line from the right edge to the
 *  left; once it has arrived, the page scrolls on. */
export function Tiny() {
  const ref = useRef<HTMLDivElement>(null);
  const road = useRef<HTMLDivElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const span = useRef(0); // how far the car travels: the road's width less the car's
  const x = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // right edge at the start of the hold, left edge at the end of it
  const place = (p: number) => x.set((1 - Math.min(1, Math.max(0, (p - 0.04) / 0.88))) * span.current);
  useMotionValueEvent(scrollYProgress, "change", place);
  useEffect(() => {
    const measure = () => {
      span.current = Math.max(0, (road.current?.clientWidth ?? 0) - (car.current?.offsetWidth ?? 0));
      place(scrollYProgress.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (road.current) ro.observe(road.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} className="relative h-[230svh]">
      <div className="gut sticky top-0 flex h-svh flex-col justify-center">
      <p className="display text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold">
        Care, down to the smallest <em>detail.</em>
      </p>
      <div ref={road} className="relative mt-6 h-[clamp(70px,7.4vw,104px)] overflow-x-clip border-b border-border">
        <motion.div ref={car} style={{ x }} className="absolute bottom-[-3px] left-0 w-[clamp(110px,11vw,160px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/300sl.png" alt="A tiny silver 1954 Mercedes-Benz 300 SL" width={640} height={221} loading="lazy" className="tiny-float relative z-[1] h-auto w-full" />
          <span className="tiny-shadow absolute right-[5%] bottom-[-2px] left-[8%] h-[7px] rounded-full bg-foreground/30 blur-[4px]" />
        </motion.div>
      </div>
      <p className="mt-3 text-right text-sm text-muted-foreground max-md:text-left">1954 Mercedes-Benz 300 SL, shown at roughly 1:120</p>
      </div>
    </div>
  );
}
