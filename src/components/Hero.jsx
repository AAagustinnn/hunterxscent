import { motion, useReducedMotion } from "motion/react";
import NichoCarousel from "./NichoCarousel.jsx";

export default function Hero({ products, onOpen }) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1];
  return (
    <section id="inicio" className="mx-auto grid max-w-[1320px] items-center gap-8 px-4 pb-10 pt-8 sm:gap-10 sm:pb-14 sm:pt-10 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
        <h1 className="font-display text-[clamp(34px,9.6vw,52px)] leading-[1.06] tracking-[-0.01em] lg:text-[56px] xl:text-[62px]">
          Prueba el perfume <em className="font-medium text-accent">antes</em> de comprar la botella
        </h1>
        <p className="mt-5 max-w-[44ch] text-[16px] sm:mt-6 sm:text-[17px] leading-relaxed text-muted">
          Decants de 5 y 10 ml de diseñador, nicho y árabes, trasvasados de botellas originales.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
          <a href="#catalogo" className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition active:scale-[0.98]">Ver catálogo</a>
          <a href="#asesor" className="rounded-full border border-line px-6 py-3.5 text-[15px] font-semibold transition hover:border-ink active:scale-[0.98]">Encontrar mi aroma</a>
        </div>
      </motion.div>

      <motion.div className="w-full max-w-[680px] lg:max-w-none" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease }}>
        <NichoCarousel products={products} onOpen={onOpen} />
      </motion.div>
    </section>
  );
}
