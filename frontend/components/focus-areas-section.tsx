export default function FocusAreasSection() {
  return (
    <section id="focus-areas-section" className="containex mx-auto py-16">
      <div className="container mx-auto space-y-16">
        <div className="space-y-2">
          <p className="text-text/75 text-center tracking-wider uppercase">
            Focus areas
          </p>
          <h1 className="mb-8 text-center text-4xl leading-tight font-bold tracking-tighter capitalize md:text-5xl">
            Ai at the core
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="border-border/25 space-y-6 rounded-3xl border-2 bg-black/5 p-8 shadow-lg shadow-black/50 backdrop-blur-xl">
            <img src="./placeholder.svg" className="h-16 w-16" alt="" />
            <h1 className="text-text text-xl font-bold">Security</h1>
            <p className="text-text/75 text-lg">
              AI-powered security solutions for threat detection and response
              systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
