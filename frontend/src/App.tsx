import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetail from "./pages/ProductDetail";
import TermsOfCondition from "./pages/TermsOfCondition";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";
import ScrollToTop from "../components/ui/scroll-to-top";
import { CookieConsent } from "../components/ui/cookie-consent";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CookieConsent />
      <Header />
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-1">
          <img src="/site-bg-top.png" className="w-full select-none" alt="" />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/terms-of-condition" element={<TermsOfCondition />} />
          <Route path="/support" element={<Support />} />
        </Routes>
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
