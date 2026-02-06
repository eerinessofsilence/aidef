import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Home from "./pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetail from "./pages/ProductDetail";
import CivilProductDetail from "./pages/CivilProductDetail";
import Technology from "./pages/Technology";
import TermsOfCondition from "./pages/TermsOfCondition";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";
import Solutions from "./pages/Solutions";
import ScrollToTop from "../components/ui/scroll-to-top";
import { CookieConsent } from "../components/ui/cookie-consent";
import Auth from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import i18n, {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  replaceLanguageInPath,
  resolveLanguage,
} from "./i18n";
import { gtmPageView } from "./analytics/gtm";

function LanguageLayout() {
  const { lng } = useParams();
  const location = useLocation();
  const activeLanguage = resolveLanguage(lng);
  const isValidLanguage = isSupportedLanguage(lng);

  // i18n
  useEffect(() => {
    if (i18n.language !== activeLanguage) {
      void i18n.changeLanguage(activeLanguage);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = activeLanguage;
    }
  }, [activeLanguage]);

  if (!isValidLanguage) {
    const targetPath = replaceLanguageInPath(
      location.pathname,
      DEFAULT_LANGUAGE,
    );
    return (
      <Navigate
        to={{
          pathname: targetPath,
          search: location.search,
          hash: location.hash,
        }}
        replace
      />
    );
  }

  // GTM
  useEffect(() => {
    if (!isValidLanguage) return;
    gtmPageView(location.pathname + location.search + location.hash);
  }, [isValidLanguage, location.pathname, location.search, location.hash]);
  return (
    <>
      <ScrollToTop />
      <CookieConsent />
      <Header />
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-1">
          <img src="/site-bg-top.png" className="w-full select-none" alt="" />
        </div>
        <Outlet />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-1">
          <img
            src="/site-bg-bottom.png"
            className="w-full select-none"
            alt=""
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />}
      />
      <Route path="/:lng" element={<LanguageLayout />}>
        <Route index element={<Home />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="civil-products/:slug" element={<CivilProductDetail />} />
        <Route path="technology" element={<Technology />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="terms-of-condition" element={<TermsOfCondition />} />
        <Route path="support" element={<Support />} />
        <Route path="auth" element={<Auth />} />
        <Route path="client-portal" element={<ClientPortal />} />
      </Route>
    </Routes>
  );
}
