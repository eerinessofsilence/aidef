export default function DroneCarouselSection() {
  return (
    <section className="container mx-auto flex items-center justify-center py-32">
      <div className="relative bg-[url(/drone-carousel-bg.png)] bg-size-[100%_100%] bg-no-repeat">
        <div className="grid grid-cols-2">
          <div className="space-y-8 pt-65 pl-25 max-xl:pt-35">
            <h1 className="text-background text-6xl font-bold">AX1</h1>
            <p className="text-background/70 max-w-115 text-lg leading-7.75">
              AI DEF is a Slovak-German research and development company that
              combines Slovak passion for innovation with German diligence and
              precision.
            </p>
            <button className="bg-background text-foreground flex h-12 w-27 items-center justify-center rounded-xl text-lg font-bold uppercase">
              View
            </button>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/our-products-drone-1.png"
              alt=""
              className="w-full max-w-[634px] object-contain"
            />
          </div>
        </div>

        <div className="flex items-end justify-end">
          <div className="text-background flex gap-15 p-10 px-54 text-2xl font-bold max-xl:p-8 max-xl:px-45">
            <h1>48MP</h1>
            <h1>MD550</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
