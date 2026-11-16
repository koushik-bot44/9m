"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { BAND, SERVICES, wa } from "@/lib/site";
import { cn } from "@/lib/utils";

const MS = 3800;

// Three frames on the coloured panel, placed like the reference: tall left, small centre, right.
const FRAMES = [
  "left-[4%] top-[8%] w-[30%] aspect-[3/4] max-md:left-[5%] max-md:top-[5%] max-md:w-[56%]",
  "left-[37.5%] top-[24%] w-[25%] aspect-square max-md:left-[34%] max-md:top-auto max-md:bottom-[5%] max-md:w-[46%]",
  "right-[4%] top-[6%] w-[30%] aspect-[4/5] max-md:right-[5%] max-md:top-[13%] max-md:w-[42%]",
];

/** Services, searched the Cosmos way: a query types itself into the search bar, and the panel colour and all
 *  three photos cut to match it in place. Tabs below advance on their own until you pick one. */
export function Services() {
  const mat = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [typed, setTyped] = useState(SERVICES[0].query);
  const [picked, setPicked] = useState(false);
  const [hover, setHover] = useState(false);
  const [seen, setSeen] = useState(false);
  const running = !picked && !hover && seen;

  useEffect(() => {
    const el = mat.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setCur((c) => (c + 1) % SERVICES.length), MS);
    return () => window.clearTimeout(t);
  }, [cur, running]);

  const s = SERVICES[cur];

  return (
    <section id="services" className="pb-[clamp(72px,10vw,150px)]">
      <div className="gut mx-auto max-w-5xl text-center">
        <h2 className="display text-[clamp(2.4rem,6.4vw,6.2rem)]">
          Every car asks for something <em>different.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[clamp(1.05rem,1.5vw,1.35rem)] leading-snug text-muted-foreground">
          PPF, ceramic, graphene and Teflon coating, deep cleaning, servicing and repairs, under one roof in KPHB.
        </p>
      </div>

      {/* the curved row from 21st.dev: photos stream round the inside of a cylinder */}
      <TiltedGridHero images={BAND} tileHeight={48} curve={78} speed={5} axis={50} className="mt-[clamp(20px,3vw,44px)] h-[300px] w-full md:h-[54svh]" />

      <div className="gut mt-[clamp(36px,5vw,72px)]">
        <div className="mx-auto max-w-[1480px]">
          <div
            ref={mat}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            className="relative aspect-[16/8.2] overflow-hidden rounded-[14px] transition-colors duration-700 max-md:aspect-[4/4.9]"
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
              className="absolute top-[54%] left-[26%] z-[1] flex h-[clamp(2.4rem,3.7vw,3.5rem)] min-w-[22%] -translate-y-1/2 items-center gap-2.5 rounded-full bg-white/90 px-[clamp(0.8rem,1.2vw,1.2rem)] text-[clamp(0.85rem,1.2vw,1.1rem)] font-medium whitespace-nowrap text-[#0e0e0f] shadow-[0_2px_8px_rgb(0_0_0/0.12)] max-md:top-[57%] max-md:left-1/2 max-md:min-w-0 max-md:-translate-x-1/2"
            >
              <Search className="size-[1.1em] opacity-60" strokeWidth={2} />
              <span>{typed}</span>
              <i className="h-[1.1em] w-[1.5px] animate-pulse bg-current" />
            </div>
          </div>

          <div role="tablist" aria-label="Services" className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
            {SERVICES.map((x, k) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                id={`svc-tab-${x.key}`}
                aria-selected={k === cur}
                aria-controls="svc-panel"
                onClick={() => {
                  setPicked(true);
                  setCur(k);
                }}
                className={cn("relative border-t border-border pt-4 text-left transition-opacity", k === cur ? "opacity-100" : "opacity-55 hover:opacity-100")}
              >
                <i
                  aria-hidden
                  key={k === cur ? `on-${cur}-${running}` : "off"}
                  className="absolute -top-px left-0 h-[2px] w-full origin-left bg-foreground"
                  style={k === cur ? (running ? { animation: `tabfill ${MS}ms linear both` } : { transform: "scaleX(1)" }) : { transform: "scaleX(0)" }}
                />
                <span className="display block text-[clamp(1.25rem,1.9vw,1.85rem)]">{x.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{x.sub}</span>
              </button>
            ))}
          </div>

          <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${s.key}`} className="mt-[clamp(24px,3vw,44px)] grid gap-6 md:grid-cols-12">
            <p className="text-[clamp(1.15rem,1.7vw,1.55rem)] leading-snug font-medium md:col-span-6">{s.line}</p>
            <div className="md:col-span-5 md:col-start-8">
              <ul className="flex flex-wrap gap-2">
                {s.points.map((pt) => (
                  <li key={pt} className="rounded-full bg-secondary px-3.5 py-2 text-[0.94rem] font-medium">
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href={wa(`Hi 9M Car Care. I'd like to ask about ${s.name.toLowerCase()}.`)}
                target="_blank"
                rel="noopener"
                className="mt-5 inline-flex items-center gap-2 border-b-[1.5px] border-current pb-0.5 font-semibold"
              >
                Ask about {s.name.toLowerCase()} on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
