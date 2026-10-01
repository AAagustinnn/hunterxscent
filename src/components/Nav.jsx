import { Handbag } from "@phosphor-icons/react";
import { useCart } from "../lib/cart.jsx";

export default function Nav({ onCart }) {
  const { count } = useCart();
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-4 md:px-8">
        <a href="#inicio" className="font-display text-[22px] font-semibold tracking-[0.08em] whitespace-nowrap">
          HUNTER <span className="italic font-medium text-accent">x</span> SCENT
        </a>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-7 text-sm text-muted md:flex">
          <a className="hover:text-ink" href="#nicho">Nicho</a>
          <a className="hover:text-ink" href="#disenador">Diseñador</a>
          <a className="hover:text-ink" href="#arabe">Árabe</a>
          <a className="hover:text-ink" href="#asesor">Asesor</a>
          <a className="hover:text-ink" href="#pedir">Cómo pedir</a>
        </nav>
        <button onClick={onCart} aria-label={`Abrir pedido, ${count} productos`}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition active:scale-[0.97] md:ml-0">
          <Handbag size={18} weight="regular" />
          Pedido
          <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-bg px-1.5 text-xs font-semibold text-ink">{count}</span>
        </button>
      </div>
    </header>
  );
}
