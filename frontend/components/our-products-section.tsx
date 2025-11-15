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
      className="container mx-auto py-16 max-lg:px-10 max-lg:py-8"
    >
      <div className="space-y-8">
        <h1 className="text-5xl font-bold max-lg:text-4xl">Our Products</h1>
        <div className="grid grid-cols-2 gap-7 max-lg:grid-cols-1">
          {PRODUCTS.map(
            ({ productName, productText, productImage, productLink }) => (
              <div className="h-112.5 rounded-xl bg-white">
                <div className="h-full space-y-2 bg-[url(./our-products-frame.png)] bg-cover bg-center px-7.5 pt-10 pb-7.5">
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
                      className="text-secondary absolute right-0 bottom-5 flex items-center gap-2 text-lg font-bold tracking-widest uppercase"
                      href={productLink}
                    >
                      View
                      <div className="bg-secondary/75 flex h-11 w-11 items-center justify-center rounded-full">
                        <ChevronRight className="text-text h-6 w-6" />
                      </div>
                    </a>
                  </div>
                  <div className="flex justify-end"></div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
