"use client";

import { type CSSProperties, type PropsWithChildren } from "react";
import { useInViewOnce } from "../../hooks/use-in-view-once";
import { cn } from "../../lib/utils";

type Direction = "up" | "down" | "left" | "right";

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
};

type ScrollRevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  duration?: number;
  from?: Direction;
  amount?: number;
  rootMargin?: string;
  distance?: number;
  ease?: string | number[];
}>;

const resolveTimingFunction = (ease: string | number[]) => {
  if (Array.isArray(ease)) {
    const [x1 = 0.22, y1 = 1, x2 = 0.36, y2 = 1] = ease;
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  }

  return ease;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  from = "up",
  amount,
  rootMargin,
  distance,
  ease = [0.22, 1, 0.36, 1] as number[],
}: ScrollRevealProps) {
  const threshold =
    typeof amount === "number" ? Math.min(Math.max(amount, 0), 1) : undefined;
  const { ref, inView } = useInViewOnce({ threshold, rootMargin });

  const baseOffset = directionOffsets[from];
  const appliedOffset = {
    x:
      distance !== undefined && baseOffset.x !== 0
        ? Math.sign(baseOffset.x) * distance
        : baseOffset.x,
    y:
      distance !== undefined && baseOffset.y !== 0
        ? Math.sign(baseOffset.y) * distance
        : baseOffset.y,
  };
  const blurDuration = Math.min(0.24, duration * 0.45);
  const timingFunction = resolveTimingFunction(ease);
  const style: CSSProperties = {
    willChange: inView ? undefined : "transform, opacity, filter",
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translate3d(0, 0, 0)"
      : `translate3d(${appliedOffset.x}px, ${appliedOffset.y}px, 0)`,
    filter: inView ? "blur(0px)" : "blur(6px)",
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}s, ${duration}s, ${blurDuration}s`,
    transitionDelay: `${delay}s, ${delay}s, ${delay}s`,
    transitionTimingFunction: `${timingFunction}, ${timingFunction}, ${timingFunction}`,
  };

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={style}
    >
      {children}
    </div>
  );
}
