"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the element comes within `margin` of the screen, and stays true. Heavy sections use it to build
 *  themselves, and videos to start downloading, only when a visitor is getting close, not on page load. */
export function useNear(ref: RefObject<Element | null>, margin = "120% 0px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}
