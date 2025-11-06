export default function TeamSection() {
  return (
    <section id="team" className="border-border border-t py-8">
      <div className="container mx-auto max-md:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6">
              <span className="tracking-ultra-wide text-text uppercase">
                OUR TEAM
              </span>
            </div>

            <h2 className="mb-8 text-4xl leading-tight font-bold tracking-tighter uppercase md:text-5xl">
              INTERNATIONAL
              <br />
              EXPERTISE
            </h2>

            <p className="text-text mb-6 text-lg leading-relaxed">
              We are an international team of experts with many years of
              experience in aviation, hardware and software engineering, defence
              and security.
            </p>

            <p className="text-text text-lg leading-relaxed">
              We blend the experience of our senior colleagues with youthful
              enthusiasm and passion for innovation.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border-2 border-white/10 bg-white/5 p-12 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:bg-white/7 hover:shadow-[0_6px_40px_rgba(0,0,0,0.5)]">
            <div
              aria-hidden
              className="from-primary/20 pointer-events-none absolute inset-0 z-0 scale-125 bg-linear-to-br via-transparent to-transparent opacity-0 blur-3xl transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-80"
            />
            <div className="relative z-10">
              <div className="mb-6">
                <div className="text-foreground mb-2 text-7xl font-bold">
                  SK + DE
                </div>
                <div className="tracking-wide-caps text-text uppercase">
                  SLOVAK-GERMAN COLLABORATION
                </div>
              </div>

              <div className="text-text space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-foreground h-1 w-1 rounded-full" />
                  <span>Aviation Specialists</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-foreground h-1 w-1 rounded-full" />
                  <span>Hardware Engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-foreground h-1 w-1 rounded-full" />
                  <span>Software Developers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-foreground h-1 w-1 rounded-full" />
                  <span>Defense Experts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
