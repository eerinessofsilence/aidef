export default function DroneCarouselSection() {
  return (
    <section className="container mx-auto flex py-25">
      <div className="relative aspect-1140/640 w-full bg-[url(/drone-carousel-bg.png)] bg-contain bg-center bg-no-repeat max-lg:aspect-335/610 max-lg:bg-[url(/drone-carousel-bg-mobile.svg)]">
        <div className="flex justify-between">
          <div className="space-y-7.5 lg:mt-55 lg:ml-10 xl:mt-85 xl:ml-15 2xl:mt-100 2xl:ml-25">
            <h1 className="text-background text-6xl font-bold">AX1</h1>
            <p className="text-background/70 max-w-115 text-lg leading-[31px]">
              AI DEF is a Slovak-German research and development company that
              combines Slovak passion for innovation with German diligence and
              precision.
            </p>
            <a href="#">
              <button className="text-foreground bg-background h-15 w-27 rounded-[9px] text-lg font-bold uppercase">
                View
              </button>
            </a>
          </div>
          <div className="flex w-1/2 items-center justify-center">
            <img src="/our-products-drone-1.png" className="w-full" alt="" />
          </div>
        </div>
        <div className="text-background absolute flex text-center text-4xl font-bold uppercase lg:right-1/5 lg:bottom-8 lg:translate-x-3.5 lg:gap-7.5 lg:text-2xl xl:right-1/5 xl:bottom-11 xl:translate-x-7 xl:gap-10 2xl:bottom-14.5 2xl:translate-x-4 2xl:gap-15">
          <h1>48MP</h1>
          <h1>MD550</h1>
        </div>
      </div>
    </section>
  );
}
