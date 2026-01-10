import { ScrollReveal } from "../../components/ui/scroll-reveal";

export default function Solutions() {
  return (
    <main>
      <section>
        <div className="relative min-h-screen">
          <img
            src="/solutions-hero-bg.png"
            className="absolute inset-0 -z-1 h-screen w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(23,43,74,0)_0%,rgba(23,43,74,0.6)_55%,#172b4a_100%)]"
          />
          <div className="relative z-10 container flex h-screen items-center">
            <ScrollReveal amount={0.2} className="space-y-7.5">
              <div className="space-y-2.5">
                <h1 className="text-7xl leading-12 font-bold max-lg:text-6xl max-md:max-w-xs max-md:text-5xl lg:leading-16">
                  AI-DEF Solutions
                </h1>
                <p className="text-foreground/90 max-w-120 text-lg">
                  Shortening the decision cycle — from detection to action —
                  faster than the situation evolves.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="container py-37.5 pt-30">
        <div className="space-y-7.5">
          <h1 className="text-5xl font-bold">Our Solutions</h1>
          <div className="space-y-5 text-lg">
            <p>
              The modern battlefield is not about who has more sensors or
              carriers. It's about who can find, confirm, track and hit the
              target faster - before the situation changes. The moment the pace
              of the conflict accelerates, manual analysis ceases to keep up. AI
              becomes a crucial skill multiplier.
            </p>
            <p>
              The decision is made by the one who can find the target faster
              (FIND), assign the right resources (ASSETS), choose the optimal
              effector, perform the hit, evaluate the effect and predict the
              opponent's reaction. AI-DEF turns sensor data into accurate
              decisions and real effects.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-25">
        <div className="container space-y-25 text-[#3F3737]">
          <ScrollReveal amount={0.2}>
            <div className="space-y-7.5">
              <h1 className="text-5xl font-bold">Why AI makes decisions</h1>
              <p className="text-lg">
                Even with the same hardware (UAVs, radars, satellites, optics),
                there is a fundamental difference in how quickly and accurately
                information is converted into action:
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.2} className="max-w-125 space-y-7.5">
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">FIND</h2>
                  <p className="text-lg">
                    Automatic detection and classification of objects in massive
                    sensor data in real time.
                  </p>
                  <p className="text-lg">
                    AI-DEF automatically searches for relevant contacts in
                    real-time and eliminates noise:
                  </p>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    detection and classification of objects/persons/vehicles
                    from EO/IR, radars and other sources
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    filtering "false positives", prioritization according to
                    threat and context
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Instant target marking, tactical image sharing (SA)
                  </li>
                </ul>
                <p className="text-lg">
                  Added value: FIND will cease to be a manual activity and will
                  become a continuous automated process.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125">
              <img
                src="/solutions-page-1.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal
              amount={0.2}
              className="max-w-125 space-y-7.5 lg:order-1"
            >
              <div className="space-y-5">
                <h2 className="text-4xl font-bold">FIX + TRACK</h2>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    FIX (precise determination): refinement of the position and
                    parameters of the target by combining several sources (data
                    fusion)
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    TRACK: predict movement, maintain contact even when
                    camouflaging, manoeuvring and jamming
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Stable target tracking even when manoeuvring, camouflaging
                    and jamming
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Prediction of trajectory and target behavior for track
                    maintenance
                  </li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125 lg:order-0">
              <img
                src="/solutions-page-2.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.2} className="max-w-125 space-y-7.5">
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">DECIDE + ASSESS</h2>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    DECIDE (choice of effect): recommendation of the optimal
                    response according to risks, stocks, distances, weather and
                    rules of use
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    ASSESS (evaluation): immediate verification of the effect
                    and update of the situational picture
                  </li>
                </ul>
                <p className="text-lg">
                  AI-DEF selects and recommends the most suitable means
                  according to:
                </p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    range, time to intervention, availability, battery/fuel
                    status and sensor
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    risks, terrain, weather, EW situation and rules of use (ROE)
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    tactical priority and value of the target
                  </li>
                </ul>
                <p className="text-lg">
                  Added value: less improvisation, more optimization — the right
                  means in the right place at the right time.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125">
              <img
                src="/solutions-page-3.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal
              amount={0.2}
              className="max-w-125 space-y-7.5 lg:order-1"
            >
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">ATTACK</h2>
                  <p className="text-lg">Attack with a suitable effector.</p>
                  <p className="text-lg">
                    AI-DEF helps to choose the optimal effector and deployment
                    method according to the type of target and situation:
                  </p>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    effector recommendation (kinetic/non-kinetic, platform,
                    intervention mode)
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    optimization of the timing and profile of the attack
                    (probability of hit vs. risk)
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    coordination of multiple means (sequential / concurrent) for
                    higher effect
                  </li>
                </ul>
                <p className="text-lg">
                  Added value: an attack is not "just a launch", but a
                  controlled process of maximizing the effect and minimizing the
                  risk.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125 lg:order-0">
              <img
                src="/solutions-page-1.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.2} className="max-w-125 space-y-7.5">
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">BDA</h2>
                  <p className="text-lg">Real-time performance evaluation.</p>
                  <p className="text-lg">
                    Without a fast BDA, the cycle lengthens and the opponent
                    gains time:
                  </p>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    automatic evaluation of intervention from sensors (EO/IR,
                    SAR/radar, telemetry)
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Resolution: destroyed / damaged / still combat-ready / moved
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    updating the situational picture and immediate correction of
                    further steps
                  </li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125">
              <img
                src="/solutions-page-2.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal
              amount={0.2}
              className="max-w-125 space-y-7.5 lg:order-1"
            >
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">
                    Prediction of the opponent's reaction
                  </h2>
                  <p className="text-lg">
                    AI-DEF also works with what will follow the hit:
                  </p>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Typical reaction prediction: move, disperse, camouflage,
                    counterattack, change EW mode
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    estimation of other likely contacts and directions of
                    leakage
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Recommendations for continuation: repeated intervention,
                    corridor blocking, change of sensor mode, transfer of own
                    assets
                  </li>
                </ul>
                <p className="text-lg">
                  Added value: You don't stop after hitting — you continue ahead
                  because you know what your opponent is likely to do.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125 lg:order-0">
              <img
                src="/solutions-page-3.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>

          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.2} className="max-w-125 space-y-7.5">
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">The result</h2>
                  <p className="text-lg">
                    Shorter kill chain, higher accuracy, fewer errors, lower
                    collateral damage and higher resistance to interference,
                    shorter cycle time, higher durability.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    kratší OODA / kill chain: FIND → FIX → TRACK → ASSETS →
                    ATTACK → BDA → predikcia reakcie
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Fewer errors and delays in decision-making
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    higher resilience in EW and the dynamics of modern conflict
                  </li>
                  <li className="flex items-center gap-5 text-lg">
                    <span className="bg-background/50 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <span className="bg-background/75 inline-block h-2.5 w-2.5 rounded-full"></span>
                    </span>
                    Scaling capabilities without increasing the number of
                    analysts
                  </li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.2} className="max-w-125">
              <img
                src="/solutions-page-1.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
