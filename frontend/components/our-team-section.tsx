export default function OurTeamSection() {
  return (
    <section id="team" className="container mx-auto py-16">
      <div className="flex justify-between">
        <div className="space-y-6">
          <p className="text-text/75 tracking-widest uppercase">Our team</p>
          <h2 className="text-4xl leading-tight font-bold capitalize md:text-5xl">
            International expertise
          </h2>
          <p className="text-text/75 text-lg leading-8">
            We are an international team of experts with many years of
            experience <br /> in aviation, hardware and software engineering,
            defence and security.
          </p>
          <p className="text-text/75 text-lg">
            We blend the experience of our senior colleagues with youthful{" "}
            <br />
            enthusiasm and passion for innovation.
          </p>
        </div>

        <div className="border-border/25 bg-foreground/5 hover:bg-foreground/8 space-y-4 rounded-2xl border-2 p-8 shadow-lg shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:shadow-xl hover:shadow-black/35">
          <div className="text-foreground flex items-center text-6xl font-bold">
            <span className="flex gap-3">
              <img src="./sk_flag.svg" width={48} alt="" />
              SK
            </span>
            <span className="mr-4 ml-6">+</span>
            <span className="flex gap-3">
              <img src="./de_flag.svg" width={48} alt="" />
              DE
            </span>
          </div>
          <p className="text-text/75 tracking-[0.2rem] uppercase">
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
        </div>
      </div>
    </section>
  );
}
