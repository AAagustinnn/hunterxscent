import { useEffect, useState } from "react";
import { Handbag, List, X } from "@phosphor-icons/react";
import { useCart } from "../lib/cart.jsx";

const LINKS = [["#nicho", "Nicho"], ["#disenador", "Diseñador"], ["#arabe", "Árabe"], ["#asesor", "Asesor"], ["#pedir", "Cómo pedir"], ["#preguntas", "Preguntas"]];

export default function Nav({ onCart }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-2 px-4 sm:gap-4 md:px-8">
        <a href="#inicio" className="min-w-0 truncate font-display text-[17px] font-semibold tracking-[0.05em] whitespace-nowrap min-[400px]:text-[20px] sm:text-[22px] sm:tracking-[0.08em]">
          HUNTER <span className="italic font-medium text-accent">x</span> SCENT
        </a>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-sm text-muted lg:flex">
          {LINKS.slice(0, 5).map(([h, t]) => <a key={h} className="whitespace-nowrap hover:text-ink" href={h}>{t}</a>)}
        </nav>
        <button onClick={onCart} aria-label={`Abrir pedido, ${count} productos`}
          className="ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-bg transition active:scale-[0.97] lg:ml-0">
          <Handbag size={18} weight="regular" />
          <span className="hidden min-[400px]:inline">Pedido</span>
          <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-bg px-1.5 text-xs font-semibold text-ink">{count}</span>
        </button>
        <button onClick={() => setOpen((v) => !v)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="menu-movil"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line lg:hidden">
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>
      {open && (
        <nav id="menu-movil" aria-label="Secciones" className="border-t border-line bg-bg lg:hidden">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-4 px-4 py-2 sm:grid-cols-3 md:px-8">
            {LINKS.map(([h, t]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="border-b border-line/60 py-3.5 text-[15px] font-medium">{t}</a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
