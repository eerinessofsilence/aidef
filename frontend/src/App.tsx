import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "./pages/ProductDetail";
import TermsAndCondition from "./pages/TermAndCondition";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/terms-and-condition" element={<TermsAndCondition />} />
      </Routes>
      <Footer />
    </>
  );
}
