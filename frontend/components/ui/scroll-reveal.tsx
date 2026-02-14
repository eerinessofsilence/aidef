"use client";

import { motion, type Easing } from "motion/react";
import { type PropsWithChildren } from "react";
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
  ease?: Easing | Easing[];
}>;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  from = "up",
  amount,
  rootMargin,
  distance,
  ease = [0.22, 1, 0.36, 1],
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

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ willChange: "transform, opacity, filter" }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {
          opacity: 0,
          x: appliedOffset.x,
          y: appliedOffset.y,
          filter: "blur(6px)",
        },
        visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
      }}
      transition={{
        opacity: { duration, delay, ease },
        x: { duration, delay, ease },
        y: { duration, delay, ease },
        filter: { duration: blurDuration, delay, ease },
      }}
    >
      {children}
    </motion.div>
  );
}
