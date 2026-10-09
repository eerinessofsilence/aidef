// Adapted from React Bits: https://reactbits.dev/components/spotlight-card
// License: ./ReactBits.LICENSE.md
import { type PointerEvent } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

export default function SpotlightCard({ children, className = "", onPointerMove, ...props }: HTMLMotionProps<"article">) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <motion.article
      {...props}
      onPointerMove={handlePointerMove}
      className={`store-spotlight-card ${className}`}
    >
      {children}
    </motion.article>
  );
}
