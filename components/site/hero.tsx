"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import GlyphPortal from "@/components/ui/glyph-portal";
import { brand } from "@/lib/fonts";
import { Pill, WaPill } from "./pill";

// The exact face next/font registered, so the portal can wait for it before measuring the letters.
const FACE = brand.style.fontFamily.split(",")[0].trim();
const smooth = (a: number, b: number, n: number) => {
  const t = Math.min(1, Math.max(0, (n - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** Inside the letters: the page and the Mustang photo, background and all, exactly like the hero before. */
function Scene({ sceneRef }: { sceneRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={sceneRef} className="hscene">
      <div className="hero__shot">
        <div className="hero__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero__img" src="/media/mustang/hero.jpg" alt="" />
          <i className="hero__tail" />
        </div>
      </div>
    </div>
  );
}

/** What you land on once you are through the 9M, then the close-up card as the camera reaches the fuel cap. */
function HeroContent() {
  return (
    <div>
      <div className="hc__one">
        <div className="hc__copy">
          <p className="mb-4 text-[0.82rem] font-semibold">Car care studio · KPHB, Hyderabad</p>
          <h1 className="display hc__title">
            <span>Down to the</span>
            <em>micron.</em>
          </h1>
        </div>
        <div className="hc__meta">
          <p className="mb-5 text-[clamp(1.02rem,1.35vw,1.28rem)] leading-snug font-medium max-md:hidden">
            Detailing, paint protection film, ceramic coating, deep cleaning, servicing and repairs. One studio in KPHB.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <WaPill />
            <Pill href="#services" tone="line" className="max-md:hidden">
              See the services
            </Pill>
          </div>
        </div>
      </div>
      <div className="hc__two">
        {/* signed off as the camera reaches the fuel cap: the name writes itself in */}
        <p className="hc__sign" aria-label="Signed, Rohith">
          &mdash; Rohith
        </p>
      </div>
    </div>
  );
}

/** Intro: a giant 9M you scroll into (Glyph Portal); the letters are filled with the Mustang's stripes.
 *  Through it, the hero as before: the Mustang's back, the 9M rising behind it, then a push-in toward the fuel cap. */
export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => {
      if (!settled) {
        settled = true;
        setFace(value);
      }
    };
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    document.fonts.load(`900 100px ${FACE}`, "9M").then(
      () => finish(`${FACE}, Arial, sans-serif`),
      () => finish("Arial, sans-serif"),
    );
    return () => {
      settled = true;
      clearTimeout(timeout);
    };
  }, []);

  // Through the letter: the photo starts full width, then settles to the right to make room for the lettering.
  const onProgress = (p: number) => {
    scene.current?.style.setProperty("--o", (1 - smooth(0.66, 0.9, p)).toFixed(4));
  };

  // The last stretch of the section pushes in toward the fuel cap, like the hero before.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = wrap.current; // set on the wrapper so both the car and the lettering can use it
    if (!el) return;
    const t = Math.min(1, Math.max(0, (v - 0.72) / 0.27));
    const z = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    el.style.setProperty("--z", z.toFixed(4));
  });

  return (
    <div ref={wrap} data-9m-portal id="top">
      {face ? (
        <GlyphPortal
          word="9M"
          fontFamily={face}
          fontWeight={900}
          scrollLength={2.4}
          wordSize={0.52}
          enterLabel="Step inside"
          onProgress={onProgress}
          style={{
            "--gp-paper": "transparent",
            "--gp-ink": "var(--foreground)",
            "--gp-field": "transparent",
            "--gp-foreground": "var(--foreground)",
            fontFamily: "var(--font-instrument), ui-sans-serif, system-ui, sans-serif",
          }}
          background={<Scene sceneRef={scene} />}
          front={
            <>
              <p className="pf__eyebrow">Car care studio · KPHB, Hyderabad</p>
              <p className="pf__brand">CAR CARE</p>
              <span className="pf__scroll">Scroll for a closer look ↓</span>
            </>
          }
        >
          <HeroContent />
        </GlyphPortal>
      ) : (
        <div className="h-svh" aria-hidden />
      )}
    </div>
  );
}
