import { ChevronRight } from "lucide-react";

const PRODUCTS = [
  {
    productName: "AX-1",
    productText: "Eletrical KAMIKAZE drone – 15 km",
    productImage: "./our-products-drone-1.png",
    productLink: "#",
  },
  {
    productName: "AX2NG KRAKATIT",
    productText: "Jet engine KAMIKAZE drone with AI",
    productImage: "./our-products-drone-2.png",
    productLink: "#",
  },
  {
    productName: "AV-1",
    productText: "vertical take-off and landing aircraft",
    productImage: "./our-products-drone-3.png",
    productLink: "#",
  },
  {
    productName: "AXQ",
    productText: "lightweight 10-inch multicopter",
    productImage: "./our-products-drone-4.png",
    productLink: "#",
  },
];

export default function OurProductsSection() {
  return (
    <section
      id="our-products-section"
      className="bg-[url('/site-bg.png')] bg-cover bg-center py-8 max-[1281px]:px-10 max-xl:py-4"
    >
      <div className="container mx-auto space-y-8">
        <h1 className="text-5xl font-bold max-lg:text-4xl">Our Products</h1>
        <div className="grid grid-cols-2 gap-7 max-lg:grid-cols-1">
          {PRODUCTS.map(
            ({ productName, productText, productImage, productLink }) => (
              <div className="h-full space-y-2 rounded-[20px] bg-[url(./our-products-card-bg.svg)] bg-cover bg-center px-7.5 pt-10 pb-7.5 transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
                <div className="space-y-4 text-center">
                  <h1 className="text-5xl font-bold text-black max-lg:text-4xl">
                    {productName}
                  </h1>
                  <p className="text-background text-xl capitalize max-lg:text-lg">
                    {productText}
                  </p>
                </div>
                <div className="relative flex h-70 items-center justify-center">
                  <img src={productImage} alt="" />
                  <a
                    className="group text-secondary absolute right-0 bottom-5 flex items-center gap-2 overflow-hidden text-lg font-bold tracking-[0.15em] uppercase transition-all duration-500 active:scale-[103%]"
                    href={productLink}
                  >
                    <span className="relative z-10 transition-[letter-spacing] duration-500 group-hover:tracking-[0.25em]">
                      View
                    </span>
                    <div className="bg-secondary/75 group-hover:bg-secondary relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 group-active:scale-110">
                      <ChevronRight className="text-text h-6 w-6 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </div>
                  </a>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
