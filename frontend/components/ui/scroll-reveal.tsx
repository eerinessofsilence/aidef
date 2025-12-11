"use client";

import { motion, useInView } from "motion/react";
import { useRef, type PropsWithChildren } from "react";
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
  distance?: number;
  ease?: number[] | string;
}>;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  from = "up",
  amount = 0.3,
  distance,
  ease = [0.22, 1, 0.36, 1],
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });

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

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {
          opacity: 0,
          x: appliedOffset.x,
          y: appliedOffset.y,
          filter: "blur(10px)",
        },
        visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
