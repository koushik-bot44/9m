"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { preload } from "react-dom";
import { useMotionValueEvent, useScroll } from "framer-motion";
import GlyphPortal from "@/components/ui/glyph-portal";
import { fillImg } from "@/lib/img";
import { Pill, WaPill } from "./pill";

// The exact face next/font registered (read from its CSS variable, so this file needn't import the font module and
// drag the stylesheet into the page's own data), so the portal can wait for it before measuring the letters.
const brandFace = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--font-montserrat").split(",")[0].trim() || "Montserrat";
const smooth = (a: number, b: number, n: number) => {
  const t = Math.min(1, Math.max(0, (n - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
// what and where, in the words people search with ("car garage in Kukatpally")
const EYEBROW = "Car garage & detailing · KPHB, Kukatpally";
// the hero photo is the page's largest paint: optimised, sized to the frame, fetched first
const HERO = fillImg("/media/mustang/hero.jpg", "", "(max-width: 899px) 160vw, 105vw", { eager: true, q: 75 });

/** Inside the letters: the page and the Mustang photo, background and all, exactly like the hero before. */
function Scene({ sceneRef }: { sceneRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={sceneRef} className="hscene">
      <div className="hero__shot">
        <div className="hero__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img {...HERO} className="hero__img" alt="" />
          <i className="hero__tail" />
        </div>
      </div>
    </div>
  );
}

/** The portal's first frame, drawn by the server so the page shows it (and the hero photo paints) before any
 *  JavaScript or web font has loaded. It is as tall as the portal section, so nothing below moves when it swaps. */
function Poster() {
  return (
    <div className="relative h-[440svh]">
      <div className="pf-poster sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className="pf-poster__mask absolute inset-0">
          <div className="hscene">
            <div className="hero__shot">
              <div className="hero__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...HERO} className="hero__img" alt="" />
              </div>
            </div>
          </div>
        </div>
        <h1 className="sr-only">9M Car Care: car garage and detailing studio in KPHB, Kukatpally, Hyderabad. Servicing, repairs, paint protection film, ceramic coating and deep cleaning.</h1>
        <p className="pf__eyebrow">{EYEBROW}</p>
        <p className="pf__brand">CAR CARE</p>
        <div data-gp-caption>
          <a data-gp-enter href="#reviews">
            Step inside<span aria-hidden="true">↘</span>
          </a>
        </div>
        <span className="pf__scroll">Scroll for a closer look ↓</span>
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
          {/* one heading for search: what and where (the small line), then the headline, styled exactly as before */}
          <h1>
            <span className="mb-4 block text-[0.82rem] font-semibold">{EYEBROW}</span>
            <span className="display hc__title block">
              <span>Down to the</span>
              <em>micron.</em>
            </span>
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
  // start the hero photo downloading from the <head>, before the portal (which waits for its font) mounts
  preload(HERO.src, { as: "image", imageSrcSet: HERO.srcSet, imageSizes: HERO.sizes, fetchPriority: "high" });
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
    const FACE = brandFace();
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
              <p className="pf__eyebrow">{EYEBROW}</p>
              <p className="pf__brand">CAR CARE</p>
              <span className="pf__scroll">Scroll for a closer look ↓</span>
            </>
          }
        >
          <HeroContent />
        </GlyphPortal>
      ) : (
        <Poster />
      )}
    </div>
  );
}
