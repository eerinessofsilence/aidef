import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "./pages/ProductDetail";
import TermsOfCondition from "./pages/TermOfCondition";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/terms-of-condition" element={<TermsOfCondition />} />
      </Routes>
      <Footer />
    </>
  );
}
