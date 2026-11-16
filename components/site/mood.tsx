"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

const MOODS = [
  { key: "day", label: "Day sky", Icon: Sun, theme: "#ebe6de" },
  { key: "dusk", label: "Pink dusk sky", Icon: Sunset, theme: "#f4e4e0" },
  { key: "night", label: "Night sky", Icon: Moon, theme: "#0e0f12" },
] as const;
type Mood = (typeof MOODS)[number]["key"];

/** Day, pink dusk and night: the whole page changes sky. Three buttons on desktop, one that cycles on phones. */
export function MoodSwitch() {
  const [mood, setMood] = useState<Mood>("day");

  useEffect(() => {
    const m = document.documentElement.getAttribute("data-mood");
    if (m === "dusk" || m === "night") setMood(m);
  }, []);

  const pick = (m: Mood) => {
    setMood(m);
    document.documentElement.setAttribute("data-mood", m);
    try {
      localStorage.setItem("9m-mood", m);
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", MOODS.find((x) => x.key === m)!.theme);
  };

  const i = MOODS.findIndex((x) => x.key === mood);
  const next = MOODS[(i + 1) % MOODS.length];
  const Current = MOODS[i].Icon;

  return (
    <>
      <div role="radiogroup" aria-label="Sky" className="hidden gap-0.5 rounded-full bg-paper/95 p-1 md:flex">
        {MOODS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={mood === key}
            aria-label={label}
            title={label}
            onClick={() => pick(key)}
            className={cn("grid size-9 place-items-center rounded-full transition-colors duration-300", mood === key ? "bg-foreground text-paper" : "hover:bg-secondary")}
          >
            <Icon className="size-[18px]" strokeWidth={1.8} />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => pick(next.key)}
        aria-label={`Sky: ${MOODS[i].label}. Switch to ${next.label}`}
        className="grid size-11 place-items-center rounded-full bg-paper/95 md:hidden"
      >
        <Current className="size-5" strokeWidth={1.8} />
      </button>
    </>
  );
}
