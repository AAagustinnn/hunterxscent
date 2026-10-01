import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { SHOT, fmt } from "../lib/catalog.js";

const DELAY = 4500;

// Carrusel de perfumes nicho: avanza solo, se pausa al pasar el mouse o enfocar, y se puede arrastrar.
export default function NichoCarousel({ products, onOpen }) {
  const reduce = useReducedMotion();
  const items = products.filter((p) => p.cat === "Nicho");
  const [[i, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const n = items.length;
  const go = useCallback((d) => setState(([k]) => [(k + d + n) % n, d]), [n]);
  const jump = (k) => setState(([cur]) => [k, k > cur ? 1 : -1]);

  useEffect(() => {
    if (reduce || paused || n < 2) return;
    timer.current = setTimeout(() => go(1), DELAY);
    return () => clearTimeout(timer.current);
  }, [i, paused, reduce, go, n]);

  if (!n) return null;
  const p = items[i % n];
  const next = items[(i + 1) % n];
  const variants = {
    enter: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="relative" role="region" aria-roledescription="carrusel" aria-label="Perfumes nicho"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
      <div className="grid grid-cols-[1fr] gap-4 sm:grid-cols-[1fr_150px]">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-2">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.button key={p.id} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              onClick={() => onOpen(p.id)} aria-label={`Ver ${p.brand} ${p.name}`}
              className="absolute inset-0 cursor-grab active:cursor-grabbing">
              <img src={SHOT[p.id]} alt={`${p.brand} ${p.name}`} draggable="false" className="h-full w-full select-none object-cover" />
            </motion.button>
          </AnimatePresence>
        </div>
        <button onClick={() => go(1)} aria-label={`Siguiente: ${next.name}`}
          className="group relative hidden overflow-hidden rounded-2xl bg-surface-2 sm:block">
          <img src={SHOT[next.id]} alt="" className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:opacity-100" />
        </button>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div aria-live="polite" className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Nicho · {p.brand}</p>
          <p className="mt-1 truncate font-display text-[28px] leading-tight">{p.name}</p>
          <p className="num mt-1 text-sm text-muted">5 ml {fmt(p.p5)} · 10 ml {fmt(p.p10)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => go(-1)} aria-label="Anterior" className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-ink active:scale-95"><CaretLeft size={18} /></button>
          <button onClick={() => go(1)} aria-label="Siguiente" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-bg transition active:scale-95"><CaretRight size={18} /></button>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Elegir perfume">
        {items.map((it, k) => (
          <button key={it.id} role="tab" aria-selected={k === i % n} aria-label={it.name} onClick={() => jump(k)}
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
            {k === i % n && (
              <motion.span className="absolute inset-y-0 left-0 bg-ink" initial={{ width: reduce || paused ? "100%" : "0%" }}
                animate={{ width: "100%" }} transition={{ duration: reduce || paused ? 0 : DELAY / 1000, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
