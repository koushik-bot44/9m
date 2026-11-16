"use client";

/* Perspective Tunnel Hero (21st.dev, @daiwiikharihar), fitted to this site.
 * Kept from the original: the golden-angle placement of the cards, each card's own
 * window of the progress, the far-to-near travel in Z, the fades, the pointer parallax
 * and the scaling centre lettering.
 * Changed for this site:
 *  - images and lettering come in as props instead of being fixed in the file
 *  - it is driven by normal page scroll (a tall section with a sticky stage) instead of
 *    capturing the mouse wheel, so the page keeps scrolling and it works by touch on phones
 *  - colours follow the site: black lettering on cream, no indigo and no gradient text
 */

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export type TunnelImage = { src: string; title: string; alt?: string };

interface TunnelCardData {
  item: TunnelImage;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    },
  );

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-muted shadow-[0_6px_8px_rgb(14_14_15/0.2)] ring-1 ring-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.item.src} alt={card.item.alt ?? card.item.title} draggable={false} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/5 to-transparent p-3 sm:p-4">
          <span className="text-xs font-semibold text-white sm:text-sm">{card.item.title}</span>
        </div>
      </div>
    </motion.div>
  );
}

export type PerspectiveTunnelHeroProps = {
  images: TunnelImage[];
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  /** Height of the scroll section, in screen heights. */
  length?: number;
  className?: string;
};

export default function PerspectiveTunnelHero({ images, eyebrow, title, subtitle, length = 4, className }: PerspectiveTunnelHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<StageDimensions>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const cards: TunnelCardData[] = useMemo(() => {
    const list = stage.isMobile ? images.slice(0, 7) : images;
    return list.map((item, i) => {
      const goldenAngle = i * 137.5 * (Math.PI / 180);
      return {
        item,
        angleCos: Math.cos(goldenAngle),
        angleSin: Math.sin(goldenAngle),
        radiusFactorX: 0.28 + (i % 3) * 0.08,
        radiusFactorY: 0.26 + (i % 2) * 0.09,
        rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        index: i,
      };
    });
  }, [images, stage.isMobile]);

  // Page scroll drives the flight: the section is tall, the stage sticks.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={sectionRef} className={className} style={{ height: `${stage.isMobile ? Math.max(3, length - 0.7) * 100 : length * 100}svh` }}>
      <div
        className="sticky top-0 flex h-[100svh] min-h-[520px] w-full select-none items-center justify-center overflow-hidden text-foreground"
        style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
      >
        {/* depth ring guides */}
        <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-foreground/10" />
        <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-foreground/15" />

        {/* central anchor lettering */}
        <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="pointer-events-none z-0 flex max-w-3xl flex-col items-center px-6 text-center">
          {eyebrow ? <p className="mb-4 text-sm font-semibold">{eyebrow}</p> : null}
          <h2 className="display text-[clamp(3.2rem,11vw,10rem)]">{title}</h2>
          {subtitle ? <p className="mt-5 max-w-[36ch] text-base text-muted-foreground sm:text-lg">{subtitle}</p> : null}
        </motion.div>

        {/* scroll prompt */}
        <motion.div style={{ opacity: promptOpacity }} className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-sm font-semibold">
          <span>Scroll to fly through</span>
          <div className="h-6 w-px bg-foreground" />
        </motion.div>

        {/* 3D Z-space plane */}
        <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {cards.map((card) => (
            <TunnelCard key={card.index} card={card} progress={smoothProgress} pointer={pointer} total={cards.length} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  );
}
