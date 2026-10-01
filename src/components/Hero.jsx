import { motion, useReducedMotion } from "motion/react";
import NichoCarousel from "./NichoCarousel.jsx";

export default function Hero({ products, onOpen }) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1];
  return (
    <section id="inicio" className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[1fr_1.1fr] md:px-8 md:pt-16">
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
        <h1 className="font-display text-[42px] leading-[1.06] tracking-[-0.01em] md:text-[52px] lg:text-[62px]">
          Prueba el perfume <em className="font-medium text-accent">antes</em> de comprar la botella
        </h1>
        <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-muted">
          Decants de 5 y 10 ml de diseñador, nicho y árabes, trasvasados de botellas originales.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#catalogo" className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition active:scale-[0.98]">Ver catálogo</a>
          <a href="#asesor" className="rounded-full border border-line px-6 py-3.5 text-[15px] font-semibold transition hover:border-ink active:scale-[0.98]">Encontrar mi aroma</a>
        </div>
      </motion.div>

      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease }}>
        <NichoCarousel products={products} onOpen={onOpen} />
      </motion.div>
    </section>
  );
}
