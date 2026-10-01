import { useEffect, useState, useCallback } from "react";
import base from "./data/products.json";
import { loadCatalog } from "./lib/catalog.js";
import { CartProvider } from "./lib/cart.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Catalog from "./components/Catalog.jsx";
import ProductSheet from "./components/ProductSheet.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Advisor from "./components/Advisor.jsx";
import HowTo from "./components/HowTo.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import { Toast } from "./components/ui.jsx";

export default function App() {
  const [products, setProducts] = useState(base.map((p) => ({ ...p })));
  const [config, setConfig] = useState({ instagram: "hunterxscent" });
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadCatalog().then(({ products, config }) => { setProducts(products); setConfig(config); }).finally(() => setLoading(false));
  }, []);

  // Enlaces directos a un perfume: #perfume-<id>
  useEffect(() => {
    const read = () => { const m = location.hash.match(/^#perfume-(.+)$/); setOpenId(m ? m[1] : null); };
    read(); window.addEventListener("hashchange", read); return () => window.removeEventListener("hashchange", read);
  }, []);
  const openProduct = useCallback((id) => { setOpenId(id); try { history.replaceState(null, "", `#perfume-${id}`); } catch (e) { /* sin historial */ } }, []);
  const closeProduct = useCallback(() => { setOpenId(null); try { history.replaceState(null, "", "#catalogo"); } catch (e) { /* sin historial */ } }, []);
  const notify = useCallback((m) => { setToast(m); clearTimeout(notify.t); notify.t = setTimeout(() => setToast(""), 2200); }, []);

  const product = products.find((p) => p.id === openId);
  return (
    <CartProvider products={products}>
      <a href="#catalogo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">Ir al catálogo</a>
      <Nav onCart={() => setCartOpen(true)} />
      <main>
        <Hero products={products} onOpen={openProduct} />
        <Catalog products={products} loading={loading} onOpen={openProduct} notify={notify} />
        <Advisor products={products} onOpen={openProduct} />
        <HowTo instagram={config.instagram} />
        <Faq />
      </main>
      <Footer instagram={config.instagram} />
      <ProductSheet product={product} onClose={closeProduct} notify={notify} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} instagram={config.instagram} notify={notify} />
      <Toast message={toast} />
    </CartProvider>
  );
}
