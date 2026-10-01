import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { SHOT, fmt } from "../lib/catalog.js";
import { Reveal } from "./ui.jsx";

const QS = [
  { key: "clima", label: "¿Cuándo lo usarías más?", opts: [["todo", "Todo el año"], ["calor", "Días de calor"], ["frio", "Noches y frío"]] },
  { key: "fam", label: "¿Qué aroma te atrae?", opts: [["", "Me da igual"], ["Cítrico", "Cítrico"], ["Fresco", "Fresco"], ["Dulce", "Dulce"], ["Amaderado", "Amaderado"], ["Especiado", "Especiado"], ["Frutal", "Frutal"]] },
  { key: "precio", label: "¿Cuánto quieres gastar en 10 ml?", opts: [["", "Sin límite"], ["10000", "Hasta $10.000"], ["20000", "Hasta $20.000"], ["nicho", "Nicho, desde $27.990"]] },
];
const TRAIL = { "Muy Alta": 0.6, Alta: 0.4, "Moderada-Alta": 0.2, Moderada: 0 };

export default function Advisor({ products, onOpen }) {
  const reduce = useReducedMotion();
  const [a, setA] = useState({ clima: "todo", fam: "", precio: "" });
  const recs = useMemo(() => products
    .filter((p) => p.stock5 !== false || p.stock10 !== false)
    .map((p) => {
      let s = TRAIL[p.trail] || 0;
      if (a.clima !== "todo") s += p.clima === a.clima ? 3 : p.clima === "todo" ? 1.5 : 0;
      if (a.fam) s += p.fams[0] === a.fam ? 4 : p.fams.includes(a.fam) ? 2.5 : 0;
      const ok = !a.precio || (a.precio === "nicho" ? p.cat === "Nicho" : p.p10 <= +a.precio);
      return [ok ? s : s - 10, p];
    })
    .sort((x, y) => y[0] - x[0]).slice(0, 3).map((x) => x[1]), [products, a]);

  return (
    <section id="asesor" className="scroll-mt-16 bg-surface-2 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <Reveal>
          <h2 className="font-display text-[40px] leading-[1.05] md:text-[56px]">¿No sabes cuál elegir?</h2>
          <p className="mt-4 max-w-[42ch] text-muted">Responde tres preguntas y te mostramos los tres decants que más calzan contigo.</p>
          <div className="mt-8 space-y-6">
            {QS.map((q) => (
              <fieldset key={q.key}>
                <legend className="mb-3 text-[15px] font-semibold">{q.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {q.opts.map(([v, l]) => (
                    <button key={v || "x"} onClick={() => setA((s) => ({ ...s, [q.key]: v }))} aria-pressed={a[q.key] === v}
                      className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition ${a[q.key] === v ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"}`}>{l}</button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Reveal>
        <div className="grid content-start gap-4">
          <AnimatePresence mode="popLayout">
            {recs.map((p, i) => (
              <motion.button key={p.id} layout={!reduce} onClick={() => onOpen(p.id)}
                initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group grid items-center gap-5 overflow-hidden rounded-2xl bg-surface text-left ${i === 0 ? "sm:grid-cols-[220px_1fr]" : "grid-cols-[112px_1fr]"}`}>
                <img src={SHOT[p.id]} alt="" className={`h-full w-full object-cover ${i === 0 ? "aspect-square sm:aspect-auto" : "aspect-square"}`} />
                <div className={`pr-5 ${i === 0 ? "px-5 pb-5 sm:px-0 sm:py-6" : "py-4"}`}>
                  {i === 0 && <p className="mb-1 text-sm font-medium text-accent">Tu mejor opción</p>}
                  <p className={`font-display leading-tight ${i === 0 ? "text-[32px]" : "text-[22px]"}`}>{p.name}</p>
                  <p className="mt-1 text-sm text-muted">{p.brand} · {p.fams.join(", ")}</p>
                  <p className="num mt-3 inline-flex items-center gap-2 text-sm font-semibold">10 ml {fmt(p.p10)}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
