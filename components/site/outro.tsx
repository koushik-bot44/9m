"use client";

import { useEffect, useRef } from "react";
import { opt } from "@/lib/img";
import { Footer } from "./footer";
import { Visit } from "./visit";

/** The end of the page under the sky (day, pink dusk or night): the enquiry, where to find the studio, the footer. */
export function Outro() {
  const stars = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = stars.current;
    if (!el) return;
    let seed = 23;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const w = window.innerWidth;
    const h = Math.min(el.parentElement?.clientHeight ?? 900, window.innerHeight * 1.4) * 0.7;
    const dots: string[] = [];
    for (let i = 0; i < 150; i++) {
      const big = rnd() < 0.14;
      dots.push(`${Math.round(rnd() * w)}px ${Math.round(Math.pow(rnd(), 1.4) * h)}px 0 ${big ? 1 : 0.4}px rgb(255 255 255 / ${(0.3 + rnd() * 0.7).toFixed(2)})`);
    }
    el.style.boxShadow = dots.join(",");
  }, []);

  /* eslint-disable @next/next/no-img-element */
  return (
    <div className="outro">
      <div className="outro__sky" aria-hidden>
        <i ref={stars} className="scene__stars" />
        <i className="scene__orb" />
        <div className="cloud cloud--o1"><img src={opt("/media/sky/cloud-4.png", 828)} width={720} height={512} alt="" loading="lazy" decoding="async" /></div>
        <div className="cloud cloud--o2"><img src={opt("/media/sky/cloud-2.png", 828)} width={720} height={568} alt="" loading="lazy" decoding="async" /></div>
        <div className="cloud cloud--o3"><img src={opt("/media/sky/cloud-3.png", 828)} width={881} height={172} alt="" loading="lazy" decoding="async" /></div>
      </div>
      <Visit />
      <Footer />
    </div>
  );
  /* eslint-enable @next/next/no-img-element */
}
