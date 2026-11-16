"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaPill } from "./pill";

type Mode = "bare" | "ceramic" | "film" | "both";
const MODES: { key: Mode; label: string }[] = [
  { key: "bare", label: "Bare paint" },
  { key: "ceramic", label: "Ceramic" },
  { key: "film", label: "Film" },
  { key: "both", label: "Both" },
];
const INFO: Record<Mode, { total: number; points: string[] }> = {
  bare: { total: 0, points: ["Factory paint is roughly 100 to 120 microns in total.", "The clear coat, about 45 microns, is all that polishing can work on.", "Every chip and wash mark goes straight into it."] },
  ceramic: { total: 2, points: ["A hard, glassy layer a few microns thick.", "It adds gloss and makes the car much easier to wash.", "It does not stop stone chips."] },
  film: { total: 180, points: ["A clear urethane film, roughly 150 to 200 microns thick.", "It absorbs stone chips and light scratches.", "Light swirls in the film can heal with warmth."] },
  both: { total: 182, points: ["Film on the panels that take the stones.", "Ceramic over everything for gloss and easy washing.", "The most protection for the least upkeep."] },
};

/** "Down to the micron", drawn literally: a cross-section of the paint with the protection on top, to scale.
 *  The page holds here while each scroll builds the next layer: bare paint, ceramic, film, then both. */
export function Micron() {
  const hold = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [small, setSmall] = useState(false); // phones use a slimmer steel layer
  const stack = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(342); // the stack's height in px; the layers are scaled to always fit it
  const mode = MODES[step].key;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const ro = new ResizeObserver(() => setRoom(stack.current?.clientHeight ?? 342));
    if (stack.current) ro.observe(stack.current);
    return () => {
      mq.removeEventListener("change", sync);
      ro.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: hold, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(MODES.length - 1, Math.floor(p * MODES.length))));

  // a tab scrolls the page to that step of the hold
  const goTo = (k: number) => {
    const el = hold.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((k + 0.45) / MODES.length) * run, behavior: "smooth" });
  };

  const STEEL = small ? 24 : 46;
  // one micron drawn as this many pixels: every layer to scale with the others, and the full stack (182 microns of
  // protection on 85 of paint) always fits the diagram, on a tall desktop or a small phone
  const PX = Math.max(0.3, (room - STEEL - 8) / 267);
  const film = mode === "film" || mode === "both";
  const ceramic = mode === "ceramic" || mode === "both";
  const layers = [
    { key: "film", name: "Protection film", um: 180, on: film, cls: "bg-white/60 ring-1 ring-black/15" },
    { key: "ceramic", name: "Ceramic coating", um: 2, on: ceramic, cls: "bg-foreground" },
    { key: "clear", name: "Clear coat", um: 45, on: true, cls: "bg-white/30 ring-1 ring-black/15" },
    { key: "colour", name: "Colour coat", um: 20, on: true, cls: "bg-[#e8641a]" },
    { key: "primer", name: "Primer", um: 20, on: true, cls: "bg-[#b9b3a8]" },
    { key: "steel", name: "Steel panel", um: 0, on: true, cls: "bg-[#6f6c68]" },
  ];
  // stack from the bottom up
  let bottom = 0;
  const placed = [...layers].reverse().map((l) => {
    const h = !l.on ? 0 : l.um ? Math.max(3, l.um * PX) : STEEL;
    const at = bottom;
    bottom += h;
    return { ...l, h, at };
  });

  return (
    <section id="micron" ref={hold} className="relative h-[260svh]">
      <div className="gut sticky top-0 grid h-svh content-center items-center gap-[clamp(14px,5vw,96px)] pt-[clamp(44px,6svh,64px)] max-md:pb-[74px] md:grid-cols-2">
        <div className="relative h-[390px] overflow-hidden rounded-[14px] bg-paper p-6 max-md:h-[min(220px,30svh)] max-md:p-4" role="img" aria-label="Cross-section of car paint showing each layer and its thickness in microns">
          <div ref={stack} className="absolute inset-x-6 top-6 bottom-6 max-md:inset-x-4 max-md:top-4 max-md:bottom-4">
            {placed.map((l) => (
              <div key={l.key} className="absolute left-0 w-[46%] transition-[bottom,height,opacity] duration-700 ease-[var(--ease-out)]" style={{ bottom: l.at, height: l.h, opacity: l.on ? 1 : 0 }}>
                <div className={cn("h-full w-full", l.cls, l.key === "film" && "rounded-t-[6px]", l.key === "steel" && "rounded-b-[6px]")} />
              </div>
            ))}
            {placed.map((l) => (
              <div
                key={l.key}
                className="absolute right-0 left-[50%] flex translate-y-1/2 items-baseline gap-x-2 whitespace-nowrap transition-[bottom,opacity] duration-700 ease-[var(--ease-out)]"
                style={{ bottom: l.at + l.h / 2, opacity: l.on ? 1 : 0 }}
              >
                <span className="h-px w-5 self-center bg-foreground/40" />
                <span className="text-[0.95rem] font-semibold max-md:text-[0.84rem]">{l.name}</span>
                <span className="text-[0.85rem] text-muted-foreground tabular-nums max-md:hidden">{l.um ? `about ${l.um} microns` : "not to scale"}</span>
              </div>
            ))}
          </div>
          <p className="absolute top-5 right-6 text-xs text-muted-foreground max-md:hidden">A human hair is roughly 70 microns.</p>
        </div>

        <div>
          <h2 className="display text-[clamp(2.1rem,5vw,5rem)]">
            Film or coating? <em>Usually both.</em>
          </h2>
          <div className="mt-5 inline-flex flex-wrap gap-1 rounded-full bg-secondary p-1 max-md:mt-3" role="tablist" aria-label="Protection">
            {MODES.map((m, k) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={mode === m.key}
                onClick={() => goTo(k)}
                className={cn("min-h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors max-md:min-h-10 max-md:px-3", mode === m.key ? "bg-foreground text-paper" : "text-muted-foreground hover:text-foreground")}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-[0.95rem] font-semibold max-md:mt-3">On top of the paint</p>
          <p className="display text-[clamp(2.3rem,4.6vw,4.4rem)] tabular-nums">
            {INFO[mode].total} <span className="text-[0.42em] font-bold italic">microns</span>
          </p>
          <ul className="mt-4 grid gap-2 max-md:mt-2">
            {INFO[mode].points.map((p) => (
              <li key={p} className="border-t border-border pt-2 text-[clamp(0.95rem,1.2vw,1.12rem)] max-md:text-[0.9rem]">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground max-md:hidden">Typical figures. They vary by car and by product, and 9M will measure yours.</p>
          <WaPill message="Hi 9M Car Care. Should my car get protection film, ceramic coating or both?" className="mt-5 max-md:hidden">
            Ask what suits your car
          </WaPill>
        </div>
      </div>
    </section>
  );
}
