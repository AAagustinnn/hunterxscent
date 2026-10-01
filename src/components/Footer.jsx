import { InstagramLogo } from "@phosphor-icons/react";

export default function Footer({ instagram }) {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-[28px] tracking-[0.08em]">HUNTER <span className="italic">x</span> SCENT</p>
          <p className="mt-3 max-w-[40ch] text-sm opacity-70">Decants de perfumes originales de diseñador, nicho y árabes, en 5 y 10 ml.</p>
        </div>
        <nav aria-label="Pie de página" className="grid content-start gap-2 text-sm">
          <a href="#nicho" className="opacity-80 hover:opacity-100">Nicho</a>
          <a href="#disenador" className="opacity-80 hover:opacity-100">Diseñador</a>
          <a href="#arabe" className="opacity-80 hover:opacity-100">Árabe</a>
          <a href="#asesor" className="opacity-80 hover:opacity-100">Asesor</a>
          <a href="#pedir" className="opacity-80 hover:opacity-100">Cómo pedir</a>
          <a href="#preguntas" className="opacity-80 hover:opacity-100">Preguntas</a>
        </nav>
        <div className="text-sm">
          <p className="opacity-70">Pedidos y consultas</p>
          <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-2 font-semibold">
            <InstagramLogo size={18} />@{instagram}
          </a>
        </div>
      </div>
    </footer>
  );
}
