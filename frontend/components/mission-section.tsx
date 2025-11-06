export default function MissionSection() {
  return (
    <section id="mission" className="border-border border-t py-8">
      <div className="container mx-auto max-md:px-8">
        <div className="mb-3">
          <span className="tracking-ultra-wide text-text uppercase">
            WE CREATE THE FUTURE
          </span>
        </div>

        <h2 className="mb-16 text-4xl leading-tight font-bold tracking-tighter uppercase md:text-5xl lg:text-6xl">
          ARTIFICIAL INTELLIGENCE DEFINITION
        </h2>

        <div className="border-border grid gap-6 border-t pt-12 md:grid-cols-2">
          <div>
            <p className="text-foreground mb-6 text-lg leading-relaxed">
              AI DEF is a Slovak-German research and development company that
              combines Slovak passion for innovation with German diligence and
              precision.
            </p>
          </div>
          <div>
            <p className="text-text text-lg leading-relaxed">
              Our main mission is to develop technologies in the field of
              artificial intelligence and automation, integrating them into
              aviation, drones, UGV, security and defense.
            </p>
          </div>
          <div>
            <p className="text-text text-lg leading-relaxed">
              We are an international team of experts with many years of
              experience in aviation, hardware and software engineering, defence
              and security. We blend the experience of our senior colleagues
              with youthful enthusiasm and passion for innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
