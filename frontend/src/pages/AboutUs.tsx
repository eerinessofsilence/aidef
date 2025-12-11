import { dispatchOpenContactModal } from "../../lib/contact-modal";

const lifecyclePhases = [
  "research",
  "design",
  "aerodynamics",
  "composites",
  "micro jet engines",
  "electronics & avionics",
  "radar & C-UAS",
  "autonomy & software",
  "service, MRO & training",
];

const heroHighlights = [
  {
    title: "Built for contested environments",
    description:
      "Operationally relevant unmanned systems engineered for EW resilience, GNSS-denied operations, and demanding missions.",
  },
  {
    title: "Lifecycle ownership",
    description:
      "From aerodynamics and composites to micro jet engines, avionics, radar, autonomy, service, and training within one group.",
  },
  {
    title: "Open integration",
    description:
      "Interoperable with existing C2/C4ISR and legacy platforms, with export control and standards compliance managed centrally.",
  },
];

const missionVision = [
  {
    title: "Our Mission",
    description:
      "Deliver reliable, operationally relevant unmanned systems and enabling technologies built for contested environments and demanding missions.",
  },
  {
    title: "Our Vision",
    description:
      "Treat autonomy, robust sensor fusion, and industrial automation as enduring capabilities engineered for long-term readiness, not short-term trends.",
  },
];

const orgUnits = [
  {
    title: "AI-DEF Group (HQ)",
    description:
      "Strategic leadership, systems architecture, and end-to-end integration with military platforms and C2/C4ISR systems.",
    bullets: [
      "Centralized export control, standards, and licensing.",
      "Unified software architecture across all UAV and UGV platforms.",
    ],
  },
  {
    title: "AI-DEF RADAR",
    description:
      "Designs radar and counter-UAS systems with multi-sensor fusion across radar, EO/IR, and acoustics.",
    bullets: [
      "High resilience against electronic warfare.",
      "Deployable on airborne, ground, and fixed installations.",
    ],
  },
  {
    title: "AI-DEF R&D",
    description:
      "Leads UAV platform development, aerodynamics, jet engines, composites, electronics, avionics, and autonomy for tactical multicopters and FPV systems.",
    bullets: [
      'Representative platforms: AX-2 / AX-2NG "Krakatit", AX-6, AX-8, FPV line, and other tactical multirotors.',
      "Full-stack engineering depth to customize mission-specific platforms.",
    ],
  },
  {
    title: "AI-DEF Service",
    description:
      "CNC and metalworking, assembly, modernization, repair, and MRO with field deployment support.",
    bullets: [
      "Mobile teams, logistics, and spare-parts supply for sustained readiness.",
      "Modernization programs that extend platform life and capability.",
    ],
  },
  {
    title: "AI-DEF Software",
    description:
      "Delivers the unified software ecosystem for flight control, telemetry, AI-assisted targeting, and mission command.",
    bullets: [
      "AI-DEF Pilot, AI-DEF Targeting, and AI-DEF GCS built for GNSS-denied navigation and edge AI.",
      "Integrates with C2/C4ISR over Starlink, LTE, 5G, and tactical mesh networks.",
    ],
  },
  {
    title: "Team1 - Advanced Edge AI & Autonomy",
    description:
      "Builds the end-to-end edge AI stack on Jetson, ROS2, and DeepStream with HMI/UI, simulation, cloud, DevOps, and security.",
    bullets: [
      "Focus on robust autonomy, sensor fusion, and reliable deployments at the edge.",
      "Simulation (Gazebo with custom physics) and Secure Boot/encryption baked in.",
    ],
  },
  {
    title: "AI-DEF Academy",
    description:
      "Trains pilots, GCS operators, technicians, and radar/C-UAS operators with mission-focused curricula.",
    bullets: [
      "Applicable certifications to keep teams current and mission-ready.",
      "Knowledge transfer that preserves operational competence across roles.",
    ],
  },
];

const capabilityAreas = [
  {
    title: "Sensors & Sensor Architecture",
    description:
      "Develops and fuses EO/IR, LIDAR, radar, IMU, and related sensor suites calibrated for precision and resilience in interference-heavy environments.",
    bullets: [
      "Multi-sensor stacks tuned for contested domains.",
      "Fusion pipelines engineered for reliable targeting and navigation.",
    ],
  },
  {
    title: "Engineering & R&D Capabilities",
    description:
      "Combines aerodynamics, propulsion, materials, electronics, and autonomy to deliver complete systems rather than isolated components.",
    bullets: [
      "Aerodynamics and airframe design with CFD, load analysis, and planform optimization.",
      "Micro jet engine development and hybrid jet/electric integration.",
      "Composite structures in CFK/Kevlar with sandwich construction for high-strength airframes.",
      "In-house electronics, avionics, and mission-specific sensor integration.",
      "Autonomous navigation, GNSS-denied operation, and robust comms (Starlink, LTE, 5G, mesh).",
    ],
  },
  {
    title: "Software, Edge AI & Autonomy",
    description:
      "AI-DEF Pilot, AI-DEF Targeting, and AI-DEF GCS form a unified ecosystem for flight control, telemetry, AI-based targeting, and mission command.",
    bullets: [
      "GNSS-denied navigation and multi-sensor fusion keep systems operational in degraded environments.",
      "Embedded and edge AI on Jetson with ROS2, DeepStream, advanced computer vision, and security-first design.",
      "Simulation (Gazebo with custom physics) ensures readiness before deployment.",
    ],
  },
  {
    title: "Industrial Automation & Smart Facilities",
    description:
      "Designs and optimizes automated factories and production lines, integrating robotics and modernizing processes as a direct extension of unmanned systems expertise.",
    bullets: [
      "Applies aerospace and defense rigor to industrial automation outcomes.",
      "Keeps production aligned with regulatory and operational requirements.",
    ],
  },
];

const peopleAndTraining = [
  {
    title: "People & Ecosystem",
    description:
      "Around 60 specialists form the AI-DEF core team, supported by subcontractors and external experts.",
    bullets: [
      "Engineering depth paired with operational experience.",
      "Collaboration with partners to solve complex technical challenges.",
    ],
  },
  {
    title: "Training & Knowledge Transfer",
    description:
      "AI-DEF Academy maintains competence across pilots, GCS operators, MRO technicians, and radar/C-UAS specialists.",
    bullets: [
      "Mission-focused training with applicable international certifications.",
      "Lifecycle knowledge transfer to sustain operational readiness.",
    ],
  },
];

const differentiators = [
  "Full vertical integration from aerodynamics and jet engines to radar, software, service, and training.",
  "Designed for contested environments with strong EW resilience and GNSS-denied capability.",
  "Advanced edge AI and autonomy with in-house software and simulation tools.",
  "In-house prototyping and small-series production across composites, electronics, and propulsion.",
  "Lifecycle approach: design, build, integrate, maintain, and train within one group.",
  "Proven multi-sensor fusion and C2/C4ISR integration across legacy and modern platforms.",
  "Shared technology base applicable to industrial automation and smart facilities.",
];

export default function AboutUs() {
  const handleContact = () => dispatchOpenContactModal();

  return (
    <div className="text-foreground">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10 mb-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(61,122,215,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(103,85,227,0.13),transparent_32%),linear-gradient(135deg,#0b172f,#0f1f3c_50%,#0a1426)]" />
          <div className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container max-w-7xl space-y-7.5">
          <div className="text-foreground/70 flex flex-wrap items-center gap-3 font-semibold uppercase">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur">
              About AI-DEF Group
            </span>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.45fr_1fr]">
            <div className="space-y-7">
              <h1 className="text-6xl leading-tight font-bold text-white max-xl:text-5xl max-md:text-4xl">
                Vertically integrated unmanned systems for contested missions.
              </h1>
              <p className="text-lg leading-8 text-white/80 max-md:text-base">
                AI-DEF Group is a vertically integrated European developer of
                modern unmanned systems and supporting technologies. The group
                spans UAV/UGV platforms, radar, autonomy, software, multi-sensor
                stacks, and industrial integration.
              </p>
              <p className="text-lg leading-8 text-white/80 max-md:text-base">
                We align engineering depth with operational needs to deliver
                systems that stay mission-ready, interoperable, and secure.
              </p>
            </div>

            <div className="grid gap-4">
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.25)] backdrop-blur"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-8 px-5 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {missionVision.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70 uppercase">
                <span className="h-1.5 w-6 rounded-full bg-white/70" />
                {item.title}
              </div>
              <p className="text-lg leading-8 text-white/85 max-md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-6 px-5 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_12px_34px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/70 uppercase">
            <span className="border-border/10 rounded-full border bg-white/5 px-3 py-1 backdrop-blur">
              Lifecycle
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {lifecyclePhases.map((phase, index) => (
              <div className="flex items-center gap-2">
                <div
                  key={phase}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 uppercase shadow-sm shadow-black/25"
                >
                  <span>{phase}</span>
                </div>
                {index !== lifecyclePhases.length - 1 && (
                  <span className="text-white">-&gt;</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-xl font-semibold text-white">
                Interoperable by design
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Systems are built to integrate with existing C2/C4ISR
                architectures and legacy platforms, ensuring interoperability
                and smooth fielding.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-xl font-semibold text-white">
                Compliance handled centrally
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Export control, standards compliance, and licensing are managed
                centrally to keep programs aligned with regulatory and
                operational requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-8 px-5 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/60 uppercase">
              Organizational Structure
            </p>
            <h2 className="text-3xl font-bold text-white max-md:text-2xl">
              Unified teams across radar, software, autonomy, and service
            </h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
            UAV + UGV + Radar + Software
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orgUnits.map((unit) => (
            <div
              key={unit.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_32px_rgba(0,0,0,0.18)]"
            >
              <h3 className="text-xl font-semibold text-white">{unit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {unit.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {unit.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-8 px-5 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/60 uppercase">
              Systems & Capabilities
            </p>
            <h2 className="text-3xl font-bold text-white max-md:text-2xl">
              Sensor fusion, engineering depth, and software-first autonomy
            </h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
            Edge AI + EW Resilience
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {capabilityAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase">
                <span className="h-1.5 w-6 rounded-full bg-white/60" />
                {area.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {area.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {area.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/55" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-8 px-5 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/60 uppercase">
              People & Readiness
            </p>
            <h2 className="text-3xl font-bold text-white max-md:text-2xl">
              Teams, partners, and training that keep systems operational
            </h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
            60+ specialists
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {peopleAndTraining.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase">
                <span className="h-1.5 w-6 rounded-full bg-white/60" />
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {item.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/55" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-8 px-5 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
          <p className="text-sm font-semibold text-white/60 uppercase">
            Key Differentiators
          </p>
          <h3 className="mt-2 text-3xl font-bold text-white max-md:text-2xl">
            What makes AI-DEF different
          </h3>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {differentiators.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 p-4"
              >
                <span className="mt-1.5 h-2 w-2 rounded-full bg-white/65" />
                <p className="text-sm leading-6 text-white/80">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleContact}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-5 py-3 text-sm font-bold text-black uppercase transition-all duration-300 ease-out hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.35)] active:scale-[0.97]"
            >
              Request technical briefing
            </button>
            <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75">
              AI-DEF Group is ready to align with your operational and
              industrial requirements.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
