"use client";

import type React from "react";
import { useState, useRef } from "react";

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
  const radius = 35;
  for (let i = 0; i < count; i++) {
    const angle = (i * angleStep - 90) * (Math.PI / 180);
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    positions.push({ x, y });
  }
  return positions;
};

const Card = ({
  item,
  position,
}: {
  item: FocusItem;
  index: number;
  position: { x: number; y: number };
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) => {
  const [transform, setTransform] = useState("translate(0, 0)");

  return (
    <div
      className="absolute transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${transform}`,
      }}
    >
      <div className="border-border/15 h-70 w-87.5 rounded-[20px] border-2 bg-white/5 p-10 shadow-lg backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-xl">
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
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
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

export default function FocusAreas({
  backgroundImageUrl,
  items = defaultItems,
  className = "",
}: FocusAreasProps) {
  const [, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const positions = getRadialPositions(items.length);

  return (
    <section
      ref={containerRef}
      className={`bg-background relative min-h-screen w-full overflow-hidden py-48 ${className}`}
      style={{
        backgroundImage: backgroundImageUrl
          ? `linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: backgroundImageUrl ? "cover" : "auto",
        backgroundPosition: "center",
      }}
    >
      <RadialConnectors itemCount={items.length} />

      {/* Center crosshair */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          src="./focus-areas-core.svg"
          className="bg-background w-50"
          alt=""
        />
      </div>

      {/* Header */}
      <div className="pointer-events-none absolute top-16 right-0 left-0 text-center">
        <p className="text-xs tracking-wider text-white/75 uppercase">
          Focus areas
        </p>
        <h1 className="text-[50px] font-bold text-white capitalize">
          Ai at the core
        </h1>
      </div>

      {/* Items */}
      <div className="relative h-screen w-full">
        {items.map((item, idx) => (
          <Card
            key={idx}
            item={item}
            index={idx}
            position={positions[idx] || { x: 50, y: 50 }}
            onMouseMove={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
    </section>
  );
}
