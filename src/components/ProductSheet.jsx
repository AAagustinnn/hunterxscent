import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Clock, TShirt, Wind } from "@phosphor-icons/react";
import { SHOT, ING } from "../lib/catalog.js";
import { useCart } from "../lib/cart.jsx";
import { SizeToggle, firstSize } from "./ui.jsx";

function Tier({ label, notes }) {
  return (
    <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[96px_1fr]">
      <p className="pt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{label}</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {notes.map((n) => (
          <li key={n.n} className="flex items-center gap-2 text-[15px]">
            <img src={ING[n.i]} alt="" className="h-11 w-11 object-contain" loading="lazy" />{n.n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductSheet({ product: p, onClose, notify }) {
  const reduce = useReducedMotion();
  const { add } = useCart();
  const [size, setSize] = useState(10);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!p) return;
    setSize(firstSize(p));
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [p, onClose]);

  return (
    <AnimatePresence>
      {p && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="sheet-title"
            initial={reduce ? { opacity: 0 } : { x: "100%" }} animate={reduce ? { opacity: 1 } : { x: 0 }} exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[980px] flex-col overflow-y-auto bg-surface pb-[env(safe-area-inset-bottom,0px)] md:flex-row md:overflow-hidden">
            <button ref={closeRef} onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-[calc(16px+env(safe-area-inset-top,0px))] z-10 grid h-10 w-10 place-items-center rounded-full bg-bg/90 backdrop-blur">
              <X size={18} />
            </button>
            <div className="shrink-0 bg-surface-2 md:w-[46%]">
              <img src={SHOT[p.id]} alt={`${p.brand} ${p.name}`} className="aspect-square h-full w-full object-cover" />
            </div>
            <div className="flex-1 space-y-6 p-6 pt-8 md:overflow-y-auto md:p-10">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">{p.brand} · {p.cat}</p>
                <h2 id="sheet-title" className="mt-2 font-display text-[40px] leading-[1.05] md:text-[48px]">{p.name}</h2>
              </div>
              <div className="space-y-4">
                <Tier label="Salida" notes={p.top} />
                <Tier label="Corazón" notes={p.mid} />
                <Tier label="Base" notes={p.base} />
              </div>
              <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-bg p-4">
                <div><dt className="flex items-center gap-1.5 text-xs text-muted"><Clock size={14} />En piel</dt><dd className="num mt-1 font-semibold">{p.skin} horas</dd></div>
                <div><dt className="flex items-center gap-1.5 text-xs text-muted"><TShirt size={14} />En ropa</dt><dd className="num mt-1 font-semibold">{p.cloth} horas</dd></div>
                <div><dt className="flex items-center gap-1.5 text-xs text-muted"><Wind size={14} />Estela</dt><dd className="mt-1 font-semibold">{p.trail}</dd></div>
              </dl>
              <p className="text-xs text-muted">Notas según Fragrantica. La duración es aproximada y cambia según piel y clima.</p>
              <div className="space-y-3 border-t border-line pt-5">
                {size === null ? <p className="text-muted">Este perfume está agotado por ahora. Escríbenos y te avisamos cuando vuelva.</p> : (
                  <>
                    <SizeToggle p={p} size={size} onChange={setSize} />
                    <button onClick={() => { add(p.id, size); notify(`${p.name} ${size} ml agregado al pedido`); }}
                      className="w-full rounded-full bg-accent py-3.5 text-[15px] font-semibold text-accent-ink transition active:scale-[0.98]">
                      Agregar {size} ml al pedido
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
