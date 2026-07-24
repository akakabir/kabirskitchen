import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;         // ms
  y?: number;             // px translate
  as?: "div" | "section" | "li" | "article";
}

// Lightweight IntersectionObserver reveal — fade + slide up on enter.
export function Reveal({ children, className, delay = 0, y = 16, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { setShown(true); obs.disconnect(); break; }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transform: shown ? "none" : `translateY(${y}px)`,
    opacity: shown ? 1 : 0,
  };

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={style}
      className={cn("transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none", className)}
    >
      {children}
    </Tag>
  );
}
