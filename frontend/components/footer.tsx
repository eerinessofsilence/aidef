export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t-4 border-[#0A1A34] bg-[#16243B] pt-38.5 pb-10 max-[1281px]:px-5 max-lg:pt-20"
    >
      <div className="container-big mx-auto">
        <div className="mb-5 flex gap-6 max-lg:flex-col lg:mb-30 lg:justify-between">
          <div className="space-y-6.5">
            <img src="/logo-ai-def.svg" className="w-42.5" alt="" />
            <img src="/we-create-the-future.svg" className="w-43.5" alt="" />
          </div>
          <div className="text-foreground/70 flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-foreground font-bold uppercase">Quick links</h1>
            <a href="#">Product</a>
            <a href="#">Services</a>
            <a href="#">Support</a>
          </div>
          <div className="text-foreground/70 flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-foreground font-bold uppercase">Contact</h1>
            <p>+421 906 949 592</p>
            <p>office@ai-def.com</p>
          </div>
          <div className="space-y-4">
            <h1 className="text-foreground font-bold uppercase">Adresses</h1>
            <div className="grid grid-cols-2 gap-y-5">
              <div className="max-w-90">
                <h1 className="text-foreground/50 font-bold uppercase">
                  Management and administration
                </h1>
                <p className="text-foreground/50 text-[15px]">
                  Vedecký park - Ilkovičova, 8841 02 Bratislava Slovakia
                </p>
              </div>
              <div className="max-w-90">
                <h1 className="text-foreground/50 font-bold uppercase">
                  Prototype laboratory
                </h1>
                <p className="text-foreground/50 text-[15px]">
                  Nádražná 75/2, 907 01 Myjava, Slovakia
                </p>
              </div>
              <div className="max-w-90">
                <h1 className="text-foreground/50 font-bold uppercase">
                  Headquarters & Development centre
                </h1>
                <p className="text-foreground/50 text-[15px]">
                  Staničná 267/21, 906 13 Brezová pod Bradlom
                </p>
              </div>
              <div className="flex max-w-90 items-center gap-4.5">
                <a href="">
                  <img src="/linkedin-logo.svg" alt="" />
                </a>
                <a href="">
                  <img src="/instagram-logo.svg" alt="" />
                </a>
                <a href="">
                  <img src="/facebook-logo.svg" alt="" />
                </a>
                <a href="">
                  <img src="/twitter-logo.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-foreground/50 text-center uppercase">
            © AI DEF A.S. 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
