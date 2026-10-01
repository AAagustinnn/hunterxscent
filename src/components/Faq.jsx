import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";

const QA = [
  ["¿Los perfumes son originales?", "Sí. Cada decant se trasvasa directamente desde la botella original del perfume."],
  ["¿Cuánto dura un decant?", "Un decant de 5 ml rinde entre 60 y 75 atomizaciones, y uno de 10 ml entre 120 y 150. Depende de cuánto uses por día."],
  ["¿Cómo pago y cuánto cuesta el envío?", "Lo coordinamos por mensaje directo en Instagram según tu comuna, antes de preparar el pedido."],
  ["¿Qué pasa si un perfume aparece agotado?", "Escríbenos igual. Te avisamos apenas vuelva o te recomendamos uno parecido."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="preguntas" className="scroll-mt-16 border-t border-line py-16 md:py-24">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <h2 className="font-display text-[40px] leading-[1.05] md:text-[56px]">Preguntas frecuentes</h2>
        <div>
          {QA.map(([q, a], i) => (
            <div key={q} className="border-b border-line">
              <button id={`faq-${i}`} aria-expanded={open === i} aria-controls={`faq-p-${i}`} onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium">
                {q}<Plus size={20} className={`shrink-0 transition ${open === i ? "rotate-45" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-[60ch] pb-5 text-muted">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
