export default function DroneCarouselSection() {
  return (
    <section className="container mx-auto flex aspect-1140/640 items-center justify-center max-lg:aspect-335/700 md:py-8 xl:py-16">
      <div className="relative bg-[url(/drone-carousel-bg.png)] bg-size-[100%_100%] bg-center bg-no-repeat max-lg:h-full max-lg:w-[75%] max-lg:bg-[url(/drone-carousel-bg-mobile.svg)] max-md:h-full max-md:w-full">
        <div className="grid grid-cols-2 max-lg:grid-cols-1">
          <div className="flex flex-col space-y-8 max-lg:order-2 max-lg:items-center max-lg:text-center max-lg:text-balance lg:pt-65 lg:pl-25">
            <h1 className="text-background text-6xl font-bold">AX1</h1>
            <p className="text-background/70 max-w-115 text-lg leading-7.75 max-md:text-sm">
              AI DEF is a Slovak-German research and development company that
              combines Slovak passion for innovation with German diligence and
              precision.
            </p>
            <a href="#">
              <button className="bg-background text-foreground flex h-12 w-27 items-center justify-center rounded-xl text-lg font-bold uppercase max-md:text-sm">
                View
              </button>
            </a>
          </div>
          <div className="flex items-center justify-center max-lg:mt-100 max-md:mt-40">
            <img
              src="/our-products-drone-1.png"
              alt=""
              className="aspect-634/370 w-full object-contain max-lg:w-[75%]"
            />
          </div>
        </div>

        <div className="flex lg:items-end lg:justify-end">
          <div className="text-background flex gap-15 p-10 px-52.5 text-2xl font-bold max-xl:gap-12 max-xl:p-8 max-xl:px-47 max-lg:p-93 max-lg:px-15 max-lg:text-3xl max-md:gap-10 max-md:p-40 max-md:px-8 max-md:text-xl">
            <h1>48MP</h1>
            <h1>MD550</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
