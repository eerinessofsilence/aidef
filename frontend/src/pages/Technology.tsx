import { Link } from "react-router-dom";

const CARDS = [
  {
    icon: "technology-1.svg",
    title: "DEFgroundPilot",
    description:
      "mission planning, flight control, telemetry and health monitoring.",
  },
  {
    icon: "technology-2.svg",
    title: "DEFgroundTargeting",
    description:
      "AI video analytics for detection, classification and tracking of targets.",
  },
  {
    icon: "technology-3.svg",
    title: "DEFgroundGateway",
    description:
      "secure, multi-link communication management for RF, LTE and satellite links.",
  },
  {
    icon: "technology-4.svg",
    title: "DEFgroundInstaller",
    description:
      "software deployment, updates, diagnostics and configuration management.",
  },
];

export default function Technology() {
  return (
    <main>
      <section>
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            preload="none"
            src="/technology-video.mp4"
            className="absolute inset-0 -z-1 h-screen w-full object-cover"
          ></video>

          <div className="container flex h-screen flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p className="text-foreground/50 text-lg uppercase max-md:text-base lg:tracking-widest">
                We create the future
              </p>
              <h1 className="text-center text-6xl leading-12 font-bold uppercase max-lg:text-5xl max-md:max-w-xs max-md:text-4xl lg:leading-16">
                AI-DEF Software
              </h1>
            </div>

            <Link
              to={`/solutions`}
              className="group relative inline-flex h-12 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold tracking-wide text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:text-base"
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="flex h-screen w-full items-end justify-end bg-[url(/technology-bg-1.png)] bg-cover bg-center bg-no-repeat">
          <div className="container">
            <div className="mb-15 space-y-5">
              <h1 className="text-5xl font-bold max-lg:text-4xl max-md:text-center max-md:text-3xl">
                Overview
              </h1>
              <p className="text-foreground/70 text-lg max-md:text-center max-md:text-base max-md:text-balance">
                The AI-DEF Software Suite is a fully integrated software
                ecosystem for mission planning, command and control of unmanned
                systems and exploitation of sensor data. It consists of several
                modules that work together to provide end-to-end support for UAV
                and UGV operations.
              </p>
            </div>
          </div>
        </div>
        <div className="flex min-h-screen w-full items-end justify-end bg-[url(/technology-bg-2.png)] bg-cover bg-center bg-no-repeat py-30 max-md:py-20">
          <div className="container">
            <h1 className="mb-25 text-center text-5xl font-bold max-lg:text-4xl max-md:mb-10 max-md:text-center max-md:text-3xl">
              Modules
            </h1>
            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              {CARDS.map((item) => (
                <div className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:scale-105">
                  <div className="border-border/15 h-full w-full rounded-[20px] border-2 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-xl">
                    <img src={item.icon} className="mb-3 h-15 w-15" alt="" />
                    <h3 className="text-foreground mb-2.5 text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="text-foreground/70 capitalize">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-screen w-full items-end justify-end bg-[url(/technology-bg-3.png)] bg-cover bg-center bg-no-repeat">
          <div className="container">
            <div className="mb-15 space-y-5">
              <h1 className="text-5xl font-bold max-lg:text-4xl max-md:text-center max-md:text-3xl">
                Integration with AI-DEF Platforms{" "}
              </h1>
              <p className="text-foreground/70 text-lg max-md:text-center max-md:text-base max-md:text-balance">
                The Software Suite is natively integrated with the avionics of
                AX2NG KRAKATIT, AV-1 VTOL, AXQ quadcopter and UGV 150-DUP. This
                ensures consistent user experience, unified mission planning and
                simplified training across the entire AI-DEF portfolio.
              </p>
            </div>
          </div>
        </div>
        <div className="flex h-screen w-full items-end justify-end bg-[url(/technology-bg-4.png)] bg-cover bg-center bg-no-repeat">
          <div className="container">
            <div className="mb-15 space-y-5">
              <h1 className="text-5xl font-bold max-lg:text-4xl max-md:text-center max-md:text-3xl">
                Integration with AI-DEF Platforms{" "}
              </h1>
              <p className="text-foreground/70 text-lg max-md:text-center max-md:text-base max-md:text-balance">
                The Software Suite is natively integrated with the avionics of
                AX2NG KRAKATIT, AV-1 VTOL, AXQ quadcopter and UGV 150-DUP. This
                ensures consistent user experience, unified mission planning and
                simplified training across the entire AI-DEF portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
