const focusAreas = [
  {
    title: "AVIATION",
    description:
      "Advanced AI systems for next-generation aircraft and autonomous flight control.",
  },
  {
    title: "DRONES",
    description:
      "Intelligent drone systems with autonomous navigation and mission planning.",
  },
  {
    title: "UGV",
    description:
      "Unmanned ground vehicles with advanced perception and decision-making capabilities.",
  },
  {
    title: "SECURITY",
    description:
      "AI-powered security solutions for threat detection and response systems.",
  },
  {
    title: "DEFENSE",
    description:
      "Cutting-edge defense technologies combining AI with tactical operations.",
  },
  {
    title: "AUTOMATION",
    description:
      "Industrial automation systems leveraging machine learning and robotics.",
  },
];

export default function FocusAreasSection() {
  return (
    <section id="focus" className="border-border border-t py-8">
      <div className="container mx-auto max-md:px-8">
        <div className="mb-3">
          <span className="tracking-ultra-wide text-text uppercase">
            FOCUS AREAS
          </span>
        </div>

        <h2 className="mb-8 text-4xl leading-tight font-bold tracking-tighter uppercase md:text-5xl">
          AI AT THE CORE
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <div className="rounded-2xl border-2 border-white/10 bg-white/5 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:bg-white/7 hover:shadow-[0_6px_40px_rgba(0,0,0,0.5)]">
              <div
                aria-hidden
                className="from-primary/10 via-primary/5 pointer-events-none absolute inset-0 translate-y-full bg-linear-to-t to-transparent opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              />
              <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                <h1 className="tracking-wide-caps text-2xl uppercase">
                  {area.title}
                </h1>
              </div>
              <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                <div className="text-text group-hover:text-foreground text-lg leading-relaxed transition-colors duration-500 ease-out">
                  {area.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
