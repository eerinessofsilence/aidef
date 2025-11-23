"use client";

import { Carousel, Card } from "./ui/apple-cards-carousel";

export default function DroneCarouselSection() {
  const cards = data.map((card, index) => (
    <Card key={card.src ?? index} card={card} index={index} bg={card.bg} />
  ));

  return (
    <div className="container mx-auto h-full w-full py-25 max-[1281px]:px-5">
      <h2 className="text-text max-w-7xl text-5xl font-bold max-lg:text-3xl max-sm:text-2xl">
        Unmanned Systems Portfolio
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="mb-4 rounded-3xl bg-[#F5F5F7] p-8 md:p-14 dark:bg-neutral-800"
          >
            <p className="mx-auto max-w-3xl font-sans text-base text-neutral-600 md:text-2xl dark:text-neutral-400">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="mx-auto h-full w-full object-contain md:h-1/2 md:w-1/2"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Drone",
    title: "AX2NG KRAKATIT",
    description: "Jet engine KAMIKAZE drone with AI",
    src: "./unmanned-systems-portfolio-1.png",
    bg: "/drone-carousel-bg-1.png",
    content: <DummyContent />,
  },
  {
    category: "Drone",
    title: "AV2 VTOL",
    description: "Vertical take-of and landing aircraft",
    src: "./unmanned-systems-portfolio-2.png",
    bg: "/drone-carousel-bg-2.png",
    content: <DummyContent />,
  },
  {
    category: "Copter",
    title: "AXQ",
    description: "Lightweight 10-inch multicopter",
    src: "./unmanned-systems-portfolio-3.png",
    bg: "/drone-carousel-bg-3.png",
    content: <DummyContent />,
  },

  {
    category: "UGV",
    title: "UGV 150-DU",
    description: "Unmanned ground platform",
    src: "./unmanned-systems-portfolio-4.png",
    bg: "/drone-carousel-bg-4.png",
    content: <DummyContent />,
  },
  {
    category: "GCS",
    title: "Ground Control Station",
    description: " Unihed control for all platforms",
    src: "./unmanned-systems-portfolio-5.jpg",
    bg: "/drone-carousel-bg-5.png",
    content: <DummyContent />,
  },
];
