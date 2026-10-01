import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { FAMS, SHOT, fmt, allNotes, norm } from "../lib/catalog.js";
import { useCart } from "../lib/cart.jsx";
import { SizeToggle, firstSize } from "./ui.jsx";

export function Card({ p, onOpen, notify }) {
  const { add } = useCart();
  const [size, setSize] = useState(firstSize(p));
  const soldOut = size === null;
  return (
    <article className="group flex w-full min-w-0 flex-col">
      <button onClick={() => onOpen(p.id)} className="relative block overflow-hidden rounded-2xl bg-surface-2" aria-label={`Ver notas de ${p.brand} ${p.name}`}>
        <img src={SHOT[p.id]} alt={`${p.brand} ${p.name}`} loading="lazy" width="900" height="900"
          className={`aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.035] ${soldOut ? "grayscale" : ""}`} />
      </button>
      <div className="mt-3 flex flex-1 flex-col gap-1 sm:mt-4 lg:flex-row lg:items-start lg:justify-between lg:gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.1em] text-muted lg:text-[12px] lg:tracking-[0.12em]">{p.brand}</p>
          <h3 className="mt-0.5 font-display text-[17px] leading-tight sm:text-[19px] lg:mt-1 lg:text-[22px]">{p.name}</h3>
          <p className="mt-1 hidden text-[13px] text-muted lg:block">{p.cat} · {p.fams.join(", ")}</p>
        </div>
        <p className="num mt-auto shrink-0 text-[15px] font-semibold lg:hidden">{soldOut ? "Agotado" : fmt(size === 5 ? p.p5 : p.p10)}</p>
        <p className="num hidden shrink-0 pt-5 text-sm text-muted lg:block">desde <span className="font-semibold text-ink">{fmt(Math.min(p.p5, p.p10))}</span></p>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 sm:mt-3 sm:gap-2">
        <div className="min-w-0 flex-1">{soldOut ? <p className="truncate rounded-full border border-line px-2 py-2 text-center text-[13px] text-muted sm:text-sm">Agotado</p>
          : <SizeToggle p={p} size={size} onChange={setSize} compact />}</div>
        <button disabled={soldOut} onClick={() => { add(p.id, size); notify(`${p.name} ${size} ml agregado al pedido`); }}
          aria-label={`Agregar ${p.name} ${size || ""} ml al pedido`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition active:scale-95 disabled:opacity-30">
          <Plus size={18} weight="bold" />
        </button>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-surface-2" />
      <div className="mt-4 h-3 w-1/3 rounded bg-surface-2" />
      <div className="mt-2 h-5 w-2/3 rounded bg-surface-2" />
      <div className="mt-4 h-10 rounded-full bg-surface-2" />
    </div>
  );
}

const SECTIONS = [
  { cat: "Nicho", id: "nicho", title: "Nicho", text: "Casas de perfumería independiente como Xerjoff, Lorenzo Pazzaglia, Louis Vuitton y Tom Ford.", cols: "md:grid-cols-3", tint: false },
  { cat: "Diseñador", id: "disenador", title: "Diseñador", text: "Los clásicos de las grandes marcas, para usar todos los días o para salir.", cols: "md:grid-cols-3 xl:grid-cols-4", tint: false },
  { cat: "Árabe", id: "arabe", title: "Árabes y de inspiración", text: "Gran rendimiento y estela a un precio accesible.", cols: "md:grid-cols-3 xl:grid-cols-4", tint: true },
];

function Grid({ list, cols, onOpen, notify, reduce }) {
  return (
    <div className={`mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-12 ${cols}`}>
      <AnimatePresence mode="popLayout">
        {list.map((p) => (
          <motion.div key={p.id} className="flex" layout={!reduce} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <Card p={p} onOpen={onOpen} notify={notify} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Catalog({ products, loading, onOpen, notify }) {
  const reduce = useReducedMotion();
  const [fams, setFams] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rel");
  const filtered = useMemo(() => {
    let l = products.filter((p) => (!fams.length || fams.some((f) => p.fams.includes(f)))
      && (!q || norm(`${p.brand} ${p.name} ${allNotes(p)}`).includes(norm(q))));
    if (sort === "asc") l = [...l].sort((a, b) => a.p10 - b.p10);
    if (sort === "desc") l = [...l].sort((a, b) => b.p10 - a.p10);
    return l;
  }, [products, fams, q, sort]);
  const toggleFam = (f) => setFams((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  const reset = () => { setFams([]); setQ(""); };
  const chip = (on) => `shrink-0 rounded-full border px-4 py-2.5 sm:py-2 text-[13.5px] font-medium transition ${on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"}`;
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.cat, filtered.filter((p) => p.cat === s.cat).length]));

  return (
    <div id="catalogo" className="scroll-mt-16">
      <div className="sticky top-[calc(64px+env(safe-area-inset-top,0px))] z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1320px] px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4">
              <MagnifyingGlass size={18} className="shrink-0 text-muted" />
              <span className="sr-only">Buscar</span>
              <input id="buscar" value={q} onChange={(e) => setQ(e.target.value)} type="search"
                placeholder="Busca perfume, marca o nota"
                className="w-full min-w-0 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-muted sm:text-[15px]" />
              {q && <button onClick={() => setQ("")} aria-label="Borrar búsqueda" className="text-muted"><X size={16} /></button>}
            </label>
            <label className="shrink-0">
              <span className="sr-only">Ordenar</span>
              <select id="orden" value={sort} onChange={(e) => setSort(e.target.value)} className="h-[46px] rounded-full border border-line bg-surface px-3 text-base font-medium text-ink sm:text-sm">
                <option value="rel">Destacados</option><option value="asc">Precio menor</option><option value="desc">Precio mayor</option>
              </select>
            </label>
          </div>
          <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto">
            <nav aria-label="Colecciones" className="flex shrink-0 gap-2">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="num shrink-0 rounded-full border border-ink/30 px-4 py-2.5 sm:py-2 text-[13.5px] font-semibold text-ink transition hover:border-ink">{s.cat} <span className="font-normal text-muted">{counts[s.cat]}</span></a>
              ))}
            </nav>
            <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />
            {FAMS.map((f) => <button key={f} onClick={() => toggleFam(f)} aria-pressed={fams.includes(f)} className={chip(fams.includes(f))}>{f}</button>)}
          </div>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-3 gap-y-8 px-4 py-12 sm:gap-6 md:grid-cols-3 md:px-8 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, k) => <Skeleton key={k} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="mx-auto max-w-[1320px] px-4 py-16 md:px-8">
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-2xl">No hay perfumes con esos filtros</p>
            <p className="mt-2 text-muted">Prueba otra nota o limpia los filtros.</p>
            <button onClick={reset} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg">Limpiar filtros</button>
          </div>
        </div>
      ) : SECTIONS.map((s) => {
        const list = filtered.filter((p) => p.cat === s.cat);
        if (!list.length) return null;
        return (
          <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`} className={`scroll-mt-40 py-11 sm:py-16 md:py-20 ${s.tint ? "bg-surface-2" : ""}`}>
            <div className="mx-auto max-w-[1320px] px-4 md:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id={`h-${s.id}`} className="font-display text-[36px] leading-none sm:text-[40px] md:text-[56px]">{s.title}</h2>
                  <p className="mt-3 max-w-[52ch] text-muted">{s.text}</p>
                </div>
                <p className="num text-sm text-muted">{list.length} {list.length === 1 ? "perfume" : "perfumes"}</p>
              </div>
              <Grid list={list} cols={s.cols} onOpen={onOpen} notify={notify} reduce={reduce} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
