"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface FocusItem {
  icon: string;
  title: string;
  description: string;
}

interface FocusAreasProps {
  backgroundImageUrl?: string;
  items?: FocusItem[];
  className?: string;
}

const defaultItems: FocusItem[] = [
  {
    icon: "focus-areas-icon-1.svg",
    title: "Security",
    description:
      "AI-powered security solutions for threat detection and response systems.",
  },
  {
    icon: "focus-areas-icon-2.svg",
    title: "Drones",
    description:
      "Intelligent drone systems with autonomous navigation and mission planning.",
  },
  {
    icon: "focus-areas-icon-3.svg",
    title: "Automation",
    description:
      "Industrial automation systems leveraging machine learning and robotics.",
  },
  {
    icon: "focus-areas-icon-4.svg",
    title: "UGV",
    description:
      "Unmanned ground vehicles with advanced perception and decision- making capabilities.",
  },
  {
    icon: "focus-areas-icon-5.svg",
    title: "Defense",
    description:
      "Cutting-edge defense technologies combining AI with tactical operations.",
  },
  {
    icon: "focus-areas-icon-6.svg",
    title: "Automation",
    description:
      "Advanced AI systems for next-generation aircraft and autonomous light control.",
  },
];

const getRadialPositions = (count: number) => {
  const positions: { x: number; y: number }[] = [];
  const angleStep = 360 / count;
  const radius = 42;
  for (let i = 0; i < count; i++) {
    const angle = (i * angleStep - 90) * (Math.PI / 180);
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    positions.push({ x, y });
  }
  return positions;
};

const RadialCard = ({
  item,
  position,
}: {
  item: FocusItem;
  position: { x: number; y: number };
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="border-border/15 h-70 w-87.5 rounded-[20px] border-2 bg-white/5 p-10 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-xl">
        <img src={item.icon} className="mb-5 max-w-15" alt="" />
        <h3 className="mb-2.5 text-xl font-bold text-white">{item.title}</h3>
        <p className="text-white/75 capitalize">{item.description}</p>
      </div>
    </div>
  );
};

const RadialConnectors = ({ itemCount }: { itemCount: number }) => {
  const positions = getRadialPositions(itemCount);

  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
      {positions.map((pos, idx) => (
        <line
          key={idx}
          x1="50%"
          y1="50%"
          x2={`${pos.x}%`}
          y2={`${pos.y}%`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export default function FocusAreas({ items = defaultItems }: FocusAreasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const positions = getRadialPositions(items.length);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const floatLayer = useTransform(scrollYProgress, [0, 1], [2, -2]);
  const slowFloat = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden bg-[url('/site-bg.png')] bg-cover bg-center bg-no-repeat px-5 pt-50 pb-25 max-lg:pt-25 max-lg:pb-12.5`}
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-black/35" />

      <div className="relative z-10 container mx-auto w-full py-37.5 max-xl:py-30 max-lg:pb-0">
        <div className="to-background from-background pointer-events-none absolute inset-y-0 left-1/2 mt-58 h-165 w-px -translate-x-1/2 bg-linear-to-b via-white/75 max-md:h-300 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="pointer-events-none absolute -top-8 right-0 left-0 text-center lg:-top-16"
        >
          <p className="text-foreground/70 text-sm font-medium tracking-widest uppercase">
            Focus areas
          </p>
          <h1 className="text-foreground text-5xl font-bold capitalize max-lg:text-4xl">
            Ai at the core
          </h1>
        </motion.div>

        <motion.div
          style={{ y: floatLayer }}
          className="relative hidden h-screen w-full lg:block"
        >
          <RadialConnectors itemCount={items.length} />

          <motion.div
            style={{ y: slowFloat }}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src="/focus-areas-core.svg"
              className="w-50 max-lg:w-36"
              alt=""
            />
          </motion.div>

          {items.map((item, idx) => (
            <RadialCard
              key={idx}
              item={item}
              position={positions[idx] || { x: 50, y: 50 }}
            />
          ))}
        </motion.div>

        <div className="lg:hidden">
          <div className="flex justify-center">
            <img
              src="/focus-areas-core.svg"
              className="w-50 max-lg:w-36"
              alt=""
            />
          </div>
          <div className="relative z-10 mt-24 grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="border-border/15 rounded-[20px] border-2 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-xl"
              >
                <img src={item.icon} className="mb-4 h-10 w-10" alt="" />
                <h3 className="mb-2 text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-white/75 capitalize">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
