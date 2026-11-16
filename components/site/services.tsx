"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Search } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { BAND, SERVICES, wa } from "@/lib/site";
import { cn } from "@/lib/utils";

const N = SERVICES.length;

// Three frames on the coloured panel, placed like the reference: tall left, small centre, right.
// On phones: two side by side on top, one centred below. No photo ever sits on another.
const FRAMES = [
  "left-[4%] top-[8%] w-[30%] aspect-[3/4] max-md:left-[5%] max-md:top-[4%] max-md:w-[43%] max-md:aspect-[4/5]",
  "left-[37.5%] top-[24%] w-[25%] aspect-square max-md:left-[25%] max-md:top-auto max-md:bottom-[4%] max-md:w-[50%] max-md:aspect-[5/4]",
  "right-[4%] top-[6%] w-[30%] aspect-[4/5] max-md:right-[5%] max-md:top-[4%] max-md:w-[43%]",
];

/** Services, searched the Cosmos way. The page holds on the panel while you scroll through the four services:
 *  each step types a new search, and the panel colour and all three photos cut to match it in place. */
export function Services() {
  const hold = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [typed, setTyped] = useState(SERVICES[0].query);

  const { scrollYProgress } = useScroll({ target: hold, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setCur(Math.min(N - 1, Math.floor(p * N))));
  // how far through the current service you are: fills the line on its tab
  const fill = useTransform(scrollYProgress, (p) => {
    const x = p * N;
    return Math.min(1, Math.max(0, x - Math.min(N - 1, Math.floor(x))));
  });

  // the query types itself in, letter by letter
  useEffect(() => {
    const q = SERVICES[cur].query;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(q);
      return;
    }
    let i = 0;
    setTyped("");
    const t = window.setInterval(() => {
      i += 1;
      setTyped(q.slice(0, i));
      if (i >= q.length) window.clearInterval(t);
    }, 32);
    return () => window.clearInterval(t);
  }, [cur]);

  // a tab scrolls the page to that service's step in the hold
  const goTo = (k: number) => {
    const el = hold.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((k + 0.45) / N) * run, behavior: "smooth" });
  };

  const s = SERVICES[cur];

  return (
    <section id="services">
      <div className="gut mx-auto max-w-5xl text-center">
        <h2 className="display text-[clamp(2.4rem,6.4vw,6.2rem)]">
          Every car asks for something <em>different.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[clamp(1.05rem,1.5vw,1.35rem)] leading-snug text-muted-foreground">
          PPF, ceramic, graphene and Teflon coating, deep cleaning, servicing and repairs, under one roof in KPHB.
        </p>
      </div>

      {/* the curved row from 21st.dev: photos stream round the inside of a cylinder, joined edge to edge */}
      <TiltedGridHero images={BAND} tileHeight={48} curve={78} gap={0} speed={5} axis={50} className="mt-[clamp(20px,3vw,44px)] h-[300px] w-full md:h-[54svh]" />

      {/* the hold: one step per service */}
      <div ref={hold} className="relative" style={{ height: `${100 + N * 55}svh` }}>
        <div className="gut sticky top-0 flex h-svh flex-col justify-center pt-[clamp(52px,7svh,80px)] pb-[clamp(10px,2svh,24px)] max-md:pb-[74px]">
          <div className="mx-auto w-full max-w-[1480px]">
            <div
              className="relative mx-auto aspect-[16/8.2] w-[min(100%,calc(54svh*16/8.2))] overflow-hidden rounded-[14px] transition-colors duration-700 max-md:aspect-[4/4.4] max-md:w-[min(100%,calc(37svh*4/4.4))]"
              style={{ background: s.mat }}
            >
              {FRAMES.map((f, k) => (
                <div key={k} className={cn("absolute overflow-hidden rounded-[6px] bg-black/10", f)}>
                  {SERVICES.map((x, j) => (
                    // every photo is already in place, so a change is an instant cut with nothing left to load
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={x.key}
                      src={x.photos[k].src}
                      alt={j === cur ? x.photos[k].alt : ""}
                      className={cn("absolute inset-0 size-full object-cover", j === cur ? "visible" : "invisible")}
                    />
                  ))}
                </div>
              ))}
              <div
                aria-hidden
                className="absolute top-[54%] left-[26%] z-[1] flex h-[clamp(2.3rem,3.4vw,3.3rem)] min-w-[22%] -translate-y-1/2 items-center gap-2.5 rounded-full bg-white/90 px-[clamp(0.8rem,1.2vw,1.2rem)] text-[clamp(0.85rem,1.15vw,1.05rem)] font-medium whitespace-nowrap text-[#0e0e0f] shadow-[0_2px_8px_rgb(0_0_0/0.12)] max-md:left-1/2 max-md:min-w-0 max-md:-translate-x-1/2"
              >
                <Search className="size-[1.1em] opacity-60" strokeWidth={2} />
                <span>{typed}</span>
                <i className="h-[1.1em] w-[1.5px] animate-pulse bg-current" />
              </div>
            </div>

            <div role="tablist" aria-label="Services" className="mx-auto mt-4 grid max-w-[1180px] grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
              {SERVICES.map((x, k) => (
                <button
                  key={x.key}
                  type="button"
                  role="tab"
                  id={`svc-tab-${x.key}`}
                  aria-selected={k === cur}
                  aria-controls="svc-panel"
                  onClick={() => goTo(k)}
                  className={cn("relative border-t border-border pt-3 text-left transition-opacity", k === cur ? "opacity-100" : "opacity-55 hover:opacity-100")}
                >
                  {/* past steps full, the current one fills as you scroll, later ones empty */}
                  <motion.i
                    aria-hidden
                    className="absolute -top-px left-0 h-[2px] w-full origin-left bg-foreground"
                    style={k === cur ? { scaleX: fill } : { scaleX: k < cur ? 1 : 0 }}
                  />
                  <span className="display block text-[clamp(1.15rem,1.7vw,1.7rem)]">{x.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{x.sub}</span>
                </button>
              ))}
            </div>

            <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${s.key}`} className="mx-auto mt-[clamp(14px,2.4svh,30px)] grid max-w-[1180px] gap-x-6 gap-y-3 md:grid-cols-12">
              <p className="text-[clamp(1.02rem,1.45vw,1.4rem)] leading-snug font-medium md:col-span-6">{s.line}</p>
              <div className="md:col-span-5 md:col-start-8">
                <ul className="flex flex-wrap gap-1.5 max-md:hidden">
                  {s.points.map((pt) => (
                    <li key={pt} className="rounded-full bg-secondary px-3 py-1.5 text-[0.9rem] font-medium">
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(`Hi 9M Car Care. I'd like to ask about ${s.name.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-flex items-center gap-2 border-b-[1.5px] border-current pb-0.5 font-semibold"
                >
                  Ask about {s.name.toLowerCase()} on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
