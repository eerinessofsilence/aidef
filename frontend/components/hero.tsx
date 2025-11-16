import LightRays from "./ui/light-rays";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[url(./hero-bg.png),linear-gradient(rgba(50,150,255,0.05))] bg-cover bg-center bg-no-repeat pt-67 pb-30 max-[1281px]:px-10 max-lg:pt-40 max-lg:pb-15">
      <div className="pointer-events-none absolute inset-0">
        <LightRays
          raysOrigin="top-right"
          raysColor="#ffffff"
          raysSpeed={1.3}
          lightSpread={1}
          rayLength={1.7}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.2}
          distortion={0.05}
          className="custom-rays h-full w-full"
        />
      </div>

      {/* Контент поверх */}
      <div className="relative z-10">
        <section className="container m-auto">
          <div className="lg:space-y-8">
            <div>
              <h1 className="text-text text-[84px] leading-26 font-bold uppercase max-lg:text-[64px] max-lg:leading-20">
                High-speed <br /> dual-mode UAV
              </h1>
            </div>
            <div className="flex w-fit flex-col space-y-10">
              <p className="uppercase lg:text-lg lg:leading-8">
                Ground-to-ground and ground-to-air precision <br /> strikes with
                HE and HEF warheads
              </p>
              <div className="space-x-4">
                <a href="#">
                  <button className="text-text-alt bg-foreground rounded-lg px-6 py-4 font-bold uppercase transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] lg:text-xl">
                    Our products
                  </button>
                </a>
                <a href="#">
                  <button className="text-text border-foreground :backdrop-blur-lg rounded-lg border bg-black/5 px-6 py-4 font-bold uppercase transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] lg:text-xl">
                    Contact us
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
