"use client";

import { useState } from "react";
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

const PX = 1.15; // one micron drawn as 1.15px, so the layers are to scale with each other

/** "Down to the micron", drawn literally: a cross-section of the paint with the protection on top, to scale. */
export function Micron() {
  const [mode, setMode] = useState<Mode>("both");
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
    const h = !l.on ? 0 : l.um ? Math.max(3, l.um * PX) : 46;
    const at = bottom;
    bottom += h;
    return { ...l, h, at };
  });

  return (
    <section id="micron" className="gut grid items-center gap-[clamp(32px,6vw,96px)] py-[clamp(72px,11vw,160px)] md:grid-cols-2">
      <div className="relative h-[390px] overflow-hidden rounded-[14px] bg-paper p-6" role="img" aria-label="Cross-section of car paint showing each layer and its thickness in microns">
        <div className="absolute inset-x-6 bottom-6 top-6">
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
        <p className="absolute top-5 right-6 text-xs text-muted-foreground">A human hair is roughly 70 microns.</p>
      </div>

      <div>
        <h2 className="display text-[clamp(2.4rem,5.6vw,5.4rem)]">
          Film or coating? <em>Usually both.</em>
        </h2>
        <div className="mt-7 inline-flex flex-wrap gap-1 rounded-full bg-secondary p-1" role="tablist" aria-label="Protection">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={mode === m.key}
              onClick={() => setMode(m.key)}
              className={cn("min-h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors", mode === m.key ? "bg-foreground text-paper" : "text-muted-foreground hover:text-foreground")}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-7 text-[0.95rem] font-semibold">On top of the paint</p>
        <p className="display text-[clamp(2.6rem,5vw,4.6rem)] tabular-nums">
          {INFO[mode].total} <span className="text-[0.42em] font-bold italic">microns</span>
        </p>
        <ul className="mt-5 grid gap-2.5">
          {INFO[mode].points.map((p) => (
            <li key={p} className="border-t border-border pt-2.5 text-[clamp(1rem,1.25vw,1.15rem)]">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">Typical figures. They vary by car and by product, and 9M will measure yours.</p>
        <WaPill message="Hi 9M Car Care. Should my car get protection film, ceramic coating or both?" className="mt-6">
          Ask what suits your car
        </WaPill>
      </div>
    </section>
  );
}
