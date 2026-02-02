import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dispatchOpenContactModal } from "../lib/contact-modal";
import { buildLocalizedPath, resolveLanguage } from "../src/i18n";

export default function Footer() {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLanguage = resolveLanguage(lng);
  const withLanguage = (path: string) =>
    buildLocalizedPath(currentLanguage, path);
  const openContactModal = () => dispatchOpenContactModal();
  return (
    <footer
      id="footer"
      className="border-t-4 border-[#0A1A34] bg-[#16243B] pt-38.5 pb-10 max-lg:pt-20"
    >
      <div className="container-big">
        <div className="mb-5 flex gap-6 max-lg:flex-col lg:mb-30 lg:justify-between">
          <div className="space-y-6.5">
            <div>
              <Link to={withLanguage("/")}>
                <img src="/logo-for-footer.svg" className="w-42.5" alt="" />
              </Link>
            </div>
            <div>
              <img src="/we-create-the-future.svg" className="w-43.5" alt="" />
            </div>
          </div>
          <div className="text-foreground/70 flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-foreground font-bold uppercase">
              {t("footer.quickLinks.title")}
            </h1>
            <Link to={withLanguage("/solutions")}>
              {t("footer.quickLinks.solutions")}
            </Link>
            <Link to={withLanguage("/technology")}>
              {t("footer.quickLinks.technology")}
            </Link>
            <Link to={withLanguage("/support")}>
              {t("footer.quickLinks.support")}
            </Link>
            <a className="cursor-pointer" onClick={openContactModal}>
              {t("footer.quickLinks.contact")}
            </a>
            <Link
              to={withLanguage("/terms-of-condition")}
              className="text-nowrap"
            >
              {t("footer.quickLinks.terms")}
            </Link>
          </div>
          <div className="text-foreground/70 flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-foreground font-bold uppercase">
              {t("footer.contact.title")}
            </h1>
            <p className="text-nowrap">office@ai-def.com</p>
            <p className="text-nowrap">Board@ai-def.com</p>
          </div>
          <div className="space-y-4">
            <h1 className="text-foreground font-bold uppercase">
              {t("footer.addresses.title")}
            </h1>
            <div className="grid grid-cols-2 gap-5">
              <div className="max-w-90">
                <h1 className="text-foreground/50 font-bold uppercase">
                  {t("footer.addresses.managementTitle")}
                </h1>
                <p className="text-foreground/50 text-[15px]">
                  {t("footer.addresses.managementAddress")}
                </p>
              </div>
              <div className="max-w-90">
                <h1 className="text-foreground/50 font-bold uppercase">
                  {t("footer.addresses.hqTitle")}
                </h1>
                <p className="text-foreground/50 text-[15px]">
                  {t("footer.addresses.hqAddress")}
                </p>
              </div>
              <div className="flex max-w-90 items-center gap-4.5">
                <a href="https://www.linkedin.com/company/aidef/">
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
            {t("footer.legal.notice")}
          </p>
        </div>
      </div>
    </footer>
  );
}
