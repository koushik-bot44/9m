"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

/** The very small floating 1954 300 SL, driving its line as you scroll past. */
export function Tiny() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["82vw", "0vw"]);
  return (
    <div ref={ref} className="gut py-[clamp(40px,6vw,90px)]">
      <p className="display text-[clamp(1.25rem,1.9vw,1.7rem)] font-bold">
        Care, down to the smallest <em>detail.</em>
      </p>
      <div className="relative mt-6 h-[clamp(70px,7.4vw,104px)] overflow-x-clip border-b border-border">
        <motion.div style={{ x }} className="absolute bottom-[-3px] left-0 w-[clamp(96px,10vw,148px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/300sl.png" alt="A tiny silver 1954 Mercedes-Benz 300 SL" width={640} height={221} loading="lazy" className="tiny-float relative z-[1] h-auto w-full" />
          <span className="tiny-shadow absolute right-[5%] bottom-[-2px] left-[8%] h-[7px] rounded-full bg-foreground/30 blur-[4px]" />
        </motion.div>
      </div>
      <p className="mt-3 text-right text-sm text-muted-foreground max-md:text-left">1954 Mercedes-Benz 300 SL, shown at roughly 1:120</p>
    </div>
  );
}
