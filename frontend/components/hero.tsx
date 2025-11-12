export default function Hero() {
  return (
    <div className="aspect-1442/772 bg-[url(./hero-bg.png),linear-gradient(rgba(50,150,255,0.1))] bg-cover bg-center bg-no-repeat py-67.5">
      <section className="container m-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-text text-[84px] leading-26 font-bold uppercase">
              High-speed <br /> dual-mode UAV
            </h1>
          </div>
          <div className="flex w-fit flex-col space-y-10">
            <p className="text-lg leading-8 uppercase">
              Ground-to-ground and ground-to-air precision <br /> strikes with
              HE and HEF warheads
            </p>
            <div className="space-x-4">
              <a href="#">
                <button className="text-text-alt rounded-lg bg-white px-6 py-4 text-xl font-bold uppercase">
                  Our products
                </button>
              </a>
              <a href="#">
                <button className="text-text rounded-lg border border-white bg-black/5 px-6 py-4 text-xl font-bold uppercase">
                  Contact us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
