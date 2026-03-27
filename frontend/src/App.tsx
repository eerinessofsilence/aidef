import { lazy, Suspense, useEffect } from "react";
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
import ScrollToTop from "../components/ui/scroll-to-top";
import { CookieConsent } from "../components/ui/cookie-consent";
import i18n, {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  replaceLanguageInPath,
  resolveLanguage,
} from "./i18n";
import { ga4PageView } from "./analytics/ga4";
import {
  COOKIE_CONSENT_EVENT,
  type CookieConsentValue,
} from "../lib/cookie-consent";
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CivilProductDetail = lazy(() => import("./pages/CivilProductDetail"));
const Technology = lazy(() => import("./pages/Technology"));
const TermsOfCondition = lazy(() => import("./pages/TermsOfCondition"));
const Support = lazy(() => import("./pages/Support"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Auth = lazy(() => import("./pages/Auth"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="container py-24 max-md:py-16">
      <div className="min-h-[40vh] rounded-[28px] border border-white/12 bg-white/6 backdrop-blur-sm" />
    </div>
  );
}

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
    const segments = location.pathname.split("/").filter(Boolean);
    const targetPath = replaceLanguageInPath(location.pathname, DEFAULT_LANGUAGE);
    const fallbackPath =
      segments.length > 1 ? targetPath : `/${DEFAULT_LANGUAGE}/404`;
    return (
      <Navigate
        to={{
          pathname: fallbackPath,
          search: location.search,
          hash: location.hash,
        }}
        replace
      />
    );
  }

  // GA4
  useEffect(() => {
    if (!isValidLanguage) return;
    ga4PageView(location.pathname + location.search + location.hash);
  }, [isValidLanguage, location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!isValidLanguage || typeof window === "undefined") return;

    const currentPagePath = location.pathname + location.search + location.hash;
    const handleConsentChange = (event: Event) => {
      const consentValue = (event as CustomEvent<CookieConsentValue>).detail;
      if (consentValue === "accepted") {
        ga4PageView(currentPagePath);
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () =>
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  }, [
    isValidLanguage,
    location.pathname,
    location.search,
    location.hash,
  ]);
  return (
    <>
      <ScrollToTop />
      <CookieConsent />
      <Header />
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-1">
          <img
            src="/site-bg-top.png"
            className="w-full select-none"
            alt=""
            fetchPriority="low"
            decoding="async"
          />
        </div>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
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
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:post" element={<BlogPost />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="terms-of-condition" element={<TermsOfCondition />} />
        <Route path="support" element={<Support />} />
        <Route path="auth" element={<Auth />} />
        <Route path="client-portal" element={<ClientPortal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
