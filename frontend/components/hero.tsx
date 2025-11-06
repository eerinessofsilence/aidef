export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden max-md:px-8">
      <div className="absolute inset-0 flex w-full blur-[2px] contrast-105">
        <video
          src="./hero-video-2.mp4"
          autoPlay
          loop
          muted
          preload="auto"
          controls={false}
          disablePictureInPicture
          className="w-full object-cover"
        ></video>
      </div>
      <div className="container mx-auto max-lg:py-8">
        <div className="flex w-fit flex-col space-y-8 rounded-2xl border-2 border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl backdrop-brightness-50 backdrop-opacity-90 transition-all duration-300 max-lg:mx-auto max-lg:w-auto max-lg:items-center">
          <div className="mb-3">
            <span className="tracking-ultra-wide text-text uppercase max-md:text-xs">
              ARTIFICIAL INTELLIGENCE DEFINITION
            </span>
          </div>
          <h1 className="text-8xl leading-[0.95] font-bold tracking-tighter uppercase max-md:text-7xl">
            BE SAFE
            <br />
            WITH US
          </h1>
          <p className="max-w-[360px] text-lg text-balance max-xl:text-base max-lg:text-center max-md:max-w-[280px] max-md:text-sm">
            Slovak-German research and development company combining Slovak
            passion for innovation with German diligence and precision.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#footer">
              <button className="tracking-wide-caps text-background hover:text-foreground hover:bg-background bg-foreground h-10 w-36 items-center justify-center rounded-xl uppercase transition-all duration-300 ease-in-out md:inline-flex">
                Contact Us
              </button>
            </a>
            <a href="#about-us">
              <button className="border-foreground hover:bg-foreground tracking-wide-caps text-foreground hover:text-background h-10 w-36 items-center justify-center rounded-xl uppercase transition-all duration-300 ease-in-out md:inline-flex">
                About Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
