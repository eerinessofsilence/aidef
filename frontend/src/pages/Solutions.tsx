import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../../components/ui/scroll-reveal";

export default function Solutions() {
  const { t } = useTranslation();
  const featureItemsRaw = t("solutions.features.items", {
    returnObjects: true,
  }) as string[] | string;
  const featureItems = Array.isArray(featureItemsRaw) ? featureItemsRaw : [];

  return (
    <main>
      <section>
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            preload="none"
            src="/solutions-video.mp4"
            className="absolute inset-0 -z-1 h-screen w-full object-cover"
          ></video>

          <div className="container flex h-screen items-center justify-center">
            <ScrollReveal amount={0.35}>
              <h1 className="text-center text-6xl leading-12 font-bold max-lg:text-5xl max-md:max-w-xs max-md:text-4xl lg:leading-16">
                {t("solutions.hero.title")}
              </h1>
            </ScrollReveal>
          </div>
        </div>
        <div></div>
      </section>
      <section className="bg-white py-25">
        <div className="container space-y-25">
          <div className="flex">
            <ScrollReveal amount={0.35}>
              <h1 className="max-w-3xl text-5xl leading-13 font-bold text-black">
                {t("solutions.overview.title")}
              </h1>
            </ScrollReveal>
          </div>
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.35} className="max-w-125 space-y-7.5">
              <div className="space-y-7.5">
                <div className="space-y-2.5">
                  <h1 className="text-4xl font-bold text-black">
                    {t("solutions.blocks.title")}
                  </h1>
                  <p className="text-lg text-black">
                    {t("solutions.blocks.description")}
                  </p>
                </div>
                <div>
                  <a
                    href="#"
                    className="rounded-xl bg-black px-4 py-3 text-lg font-semibold text-white shadow-inner shadow-white/50 transition-all duration-300 hover:bg-black/90 hover:px-5 hover:py-4"
                  >
                    {t("solutions.actions.learnMore")}
                  </a>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.35} className="max-w-125">
              <img
                src="/solutions-page-1.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal
              amount={0.35}
              className="max-w-125 space-y-7.5 lg:order-1"
            >
              <div className="space-y-7.5">
                <div className="space-y-2.5">
                  <h1 className="text-4xl font-bold text-black">
                    {t("solutions.blocks.title")}
                  </h1>
                  <p className="text-lg text-black">
                    {t("solutions.blocks.description")}
                  </p>
                </div>
                <div>
                  <a
                    href="#"
                    className="rounded-xl bg-black px-4 py-3 text-lg font-semibold text-white shadow-inner shadow-white/50 transition-all duration-300 hover:bg-black/90 hover:px-5 hover:py-4"
                  >
                    {t("solutions.actions.learnMore")}
                  </a>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.35} className="max-w-125 lg:order-0">
              <img
                src="/solutions-page-2.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <ScrollReveal amount={0.35} className="max-w-125 space-y-7.5">
              <div className="space-y-7.5">
                <div className="space-y-2.5">
                  <h1 className="text-4xl font-bold text-black">
                    {t("solutions.blocks.title")}
                  </h1>
                  <p className="text-lg text-black">
                    {t("solutions.blocks.description")}
                  </p>
                </div>
                <div>
                  <a
                    href="#"
                    className="rounded-xl bg-black px-4 py-3 text-lg font-semibold text-white shadow-inner shadow-white/50 transition-all duration-300 hover:bg-black/90 hover:px-5 hover:py-4"
                  >
                    {t("solutions.actions.learnMore")}
                  </a>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal amount={0.35} className="max-w-125">
              <img
                src="/solutions-page-3.png"
                className="w-full rounded-2xl"
                alt=""
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section className="bg-[url(/solutions-block-bg.png)] py-25">
        <div className="container">
          <div className="space-y-5">
            <div>
              <ScrollReveal amount={0.35}>
                <span className="text-semibold border-border/25 rounded-[30px] bg-white/25 px-[15px] py-2.5 text-center text-white uppercase backdrop-blur-xs">
                  {t("solutions.features.kicker")}
                </span>
              </ScrollReveal>
            </div>
            <ScrollReveal amount={0.35}>
              <h1 className="text-5xl font-bold">
                {t("solutions.features.title")}
              </h1>
            </ScrollReveal>
            <ScrollReveal amount={0.35}>
              <ul className="space-y-2.5">
                {featureItems.map((item) => (
                  <li key={item} className="flex items-center gap-5 text-lg">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30">
                      <span className="inline-block h-3.5 w-3.5 rounded-full bg-white"></span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
