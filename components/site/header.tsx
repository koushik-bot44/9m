"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MoodSwitch } from "./mood";
import { Pill, WaPill } from "./pill";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  // the scroll bar along the very top: it fills as you move down the page
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (y > last + 6 && y > 480) setHidden(true);
      else if (y < last - 6) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-foreground" />

      <header
        className={cn(
          "gut fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-4 py-3 transition-transform duration-500 ease-[var(--ease-out)] md:py-4",
          hidden && !open && "-translate-y-[120%]",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="9M Car Care, back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-9m.jpg" alt="9M Car Care logo" width={44} height={44} className="size-11 rounded-xl ring-1 ring-black/10" />
          <span className={cn("flex items-baseline gap-1.5 font-brand leading-none transition-opacity", solid && "max-md:opacity-0")}>
            <span className="text-[1.45rem] font-black tracking-[-0.02em]">9M</span>
            <span className="text-[0.74rem] font-semibold tracking-[0.14em]">CAR CARE</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
        <MoodSwitch />
        <nav aria-label="Primary" className="hidden items-center gap-7 rounded-full bg-paper/95 py-1.5 pr-1.5 pl-7 text-[0.96rem] font-semibold md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="relative py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100">
              {n.label}
            </a>
          ))}
          <WaPill size="sm">Enquire</WaPill>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu"
          className="min-h-11 rounded-full bg-paper/95 px-5 text-[0.94rem] font-semibold md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
        </div>
      </header>

      {open ? (
        <div id="menu" className="gut fixed inset-0 z-[59] flex flex-col justify-between bg-background pt-28 pb-8 md:hidden">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="display block py-1 text-[clamp(2.6rem,12vw,4.2rem)]">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-2.5">
            <WaPill className="justify-between">Enquire on WhatsApp</WaPill>
            <Pill href={`tel:${SITE.phones[0].tel}`} tone="line" className="justify-center">
              Call {SITE.phones[0].label}
            </Pill>
          </div>
        </div>
      ) : null}
    </>
  );
}
