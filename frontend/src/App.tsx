import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "../components/header";
import Footer from "../components/footer";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </>
  );
}
