import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { fmt } from "../lib/catalog.js";

export function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// Selector 5 / 10 ml con precio. Deshabilita tamaños agotados.
export function SizeToggle({ p, size, onChange, compact = false }) {
  const opts = [
    { s: 5, price: p.p5, ok: p.stock5 !== false },
    { s: 10, price: p.p10, ok: p.stock10 !== false },
  ];
  return (
    <div role="radiogroup" aria-label="Tamaño" className="grid grid-cols-2 gap-1 rounded-full border border-line bg-bg p-1">
      {opts.map((o) => (
        <button key={o.s} type="button" role="radio" aria-checked={size === o.s} disabled={!o.ok}
          onClick={() => onChange(o.s)}
          className={`rounded-full px-1.5 ${compact ? "py-2 text-[13px] lg:py-1.5" : "py-2.5 text-sm"} font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            size === o.s ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}>
          {o.s} ml <span className={`num font-semibold ${compact ? "hidden lg:inline" : ""}`}>{o.ok ? fmt(o.price) : "Agotado"}</span>
        </button>
      ))}
    </div>
  );
}

export function Toast({ message }) {
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-[70] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg shadow-lg">{message}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const firstSize = (p) => (p.stock10 !== false ? 10 : p.stock5 !== false ? 5 : null);
