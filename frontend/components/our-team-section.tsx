import SpotlightCard from "./ui/spotlight-card";

export default function OurTeamSection() {
  return (
    <section
      id="our-team-section"
      className="bg-[url('/site-bg.png')] bg-cover bg-top bg-no-repeat py-16 max-[1281px]:px-10 max-xl:py-8"
    >
      <div className="container mx-auto">
        <div className="flex justify-between max-lg:flex-col max-lg:space-y-6">
          <div className="flex flex-col space-y-6 max-lg:items-center max-lg:space-y-3 max-lg:text-center">
            <p className="text-text/70 tracking-widest uppercase">Our team</p>
            <h2 className="text-5xl font-bold capitalize max-lg:text-4xl">
              International expertise
            </h2>
            <p className="text-text/70 text-lg leading-8 max-lg:text-base max-lg:leading-6 max-lg:text-balance">
              We are an international team of experts with many years of
              experience <br /> in aviation, hardware and software engineering,
              defence and security.
            </p>
            <p className="text-text/70 text-lg leading-8 max-lg:text-base max-lg:leading-6 max-lg:text-balance">
              We blend the experience of our senior colleagues with youthful{" "}
              <br />
              enthusiasm and passion for innovation.
            </p>
          </div>

          <SpotlightCard className="border-border/25 bg-background/5 flex flex-col gap-y-3 border-2 backdrop-blur-xl">
            <div className="text-foreground flex items-center gap-3 text-6xl font-bold max-lg:justify-center max-lg:text-5xl max-md:text-4xl">
              <span className="flex gap-3 max-md:gap-2">
                <img src="./sk_flag.svg" className="w-12 max-md:w-8" alt="" />
                SK
              </span>
              <span className="">+</span>
              <span className="flex gap-3 max-md:gap-2">
                <img src="./de_flag.svg" className="w-12 max-md:w-8" alt="" />
                DE
              </span>
            </div>
            <p className="text-text/70 tracking-[0.2rem] uppercase max-xl:tracking-wide max-md:text-xs max-md:tracking-normal">
              Slovak-German collaboration
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <div className="to-secondary h-1.5 w-1.5 rounded-full bg-linear-to-br from-white/50" />
                Aviation Specialists
              </li>
              <li className="flex items-center gap-3">
                <div className="to-secondary h-1.5 w-1.5 rounded-full bg-linear-to-br from-white/50" />
                Hardware Engineers
              </li>
              <li className="flex items-center gap-3">
                <div className="to-secondary h-1.5 w-1.5 rounded-full bg-linear-to-br from-white/50" />
                <span>Software Developers</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="to-secondary h-1.5 w-1.5 rounded-full bg-linear-to-br from-white/50" />
                <span>Defense Experts</span>
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
