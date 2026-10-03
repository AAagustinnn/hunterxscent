import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Minus, Plus, Copy, InstagramLogo, Trash } from "@phosphor-icons/react";
import { SHOT, fmt } from "../lib/catalog.js";
import { useCart } from "../lib/cart.jsx";

const FIELDS = [
  { k: "nombre", label: "Nombre y apellido", auto: "name" },
  { k: "rut", label: "RUT", ph: "12.345.678-9" },
  { k: "telefono", label: "Número de teléfono", type: "tel", auto: "tel", mode: "tel", ph: "+56 9 ..." },
  { k: "correo", label: "Correo", type: "email", auto: "email", mode: "email" },
  { k: "sucursal", label: "Sucursal de Starken" },
  { k: "comuna", label: "Comuna", auto: "address-level2" },
];

export default function CartDrawer({ open, onClose, instagram, notify }) {
  const reduce = useReducedMotion();
  const { lines, total, add, dec, remove, clear } = useCart();
  const [mode, setMode] = useState(""); // "envio" | "presencial"
  const [d, setD] = useState({ nombre: "", rut: "", telefono: "", correo: "", sucursal: "", comuna: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => { setD((v) => ({ ...v, [k]: e.target.value })); setError(""); };
  const textRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const message = useMemo(() => {
    if (!lines.length) return "";
    const rows = lines.map((l) => `- ${l.qty} x ${l.p.brand} ${l.p.name} ${l.size} ml (${fmt(l.subtotal)})`);
    const out = [`Hola HUNTER X SCENT, quiero hacer este pedido:`, ...rows, `Total: ${fmt(total)} (sin envío)`];
    if (mode === "envio") {
      out.push("", "Entrega: Envío por Starken", "Datos para el envío", ...FIELDS.map((f) => `${f.label}: ${d[f.k].trim()}`));
    } else if (mode === "presencial") {
      out.push("", "Entrega: Presencial");
    }
    return out.join("\n");
  }, [lines, total, mode, d]);

  const valid = () => {
    if (!mode) { setError("Elige si quieres envío o entrega presencial."); return false; }
    if (mode === "envio") {
      const missing = FIELDS.filter((f) => !d[f.k].trim()).map((f) => f.label);
      if (missing.length) { setError(`Para el envío falta: ${missing.join(", ")}.`); return false; }
    }
    return true;
  };

  // Abre la app de Instagram en el celular (el enlace web se queda en el navegador y falla).
  // Si la app no responde, cae al enlace web del chat.
  const openInstagram = async (e) => {
    e.preventDefault();
    if (!valid()) return;
    try { await navigator.clipboard.writeText(message); notify("Pedido copiado. Toca Mensaje y pégalo"); } catch (err) { /* se copia a mano */ }
    const web = `https://ig.me/m/${instagram}`;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!mobile) { window.open(web, "_blank", "noopener"); return; }
    let left = false;
    const onHide = () => { if (document.hidden) left = true; };
    document.addEventListener("visibilitychange", onHide);
    window.location.href = `instagram://user?username=${instagram}`;
    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      if (!left && !document.hidden) window.location.href = web;
    }, 1500);
  };

  const copy = async () => {
    if (!valid()) return;
    try { await navigator.clipboard.writeText(message); notify("Pedido copiado. Pégalo en el chat de Instagram"); }
    catch (e) { textRef.current?.focus(); textRef.current?.select(); notify("Selecciona el texto y cópialo"); }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside aria-label="Tu pedido" role="dialog" aria-modal="true"
            initial={reduce ? { opacity: 0 } : { x: "100%" }} animate={reduce ? { opacity: 1 } : { x: 0 }} exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-surface pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-[30px]">Tu pedido</h2>
              <button ref={closeRef} onClick={onClose} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full border border-line"><X size={18} /></button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {!lines.length ? (
                <div className="rounded-2xl border border-dashed border-line px-5 py-12 text-center">
                  <p className="font-display text-2xl">Tu pedido está vacío</p>
                  <p className="mt-2 text-sm text-muted">Elige 5 o 10 ml en el catálogo y toca el botón +.</p>
                  <a href="#catalogo" onClick={onClose} className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg">Ir al catálogo</a>
                </div>
              ) : lines.map((l) => (
                <div key={l.key} className="grid grid-cols-[56px_1fr_auto] items-center gap-2.5 rounded-2xl bg-bg p-2 pr-2 sm:grid-cols-[64px_1fr_auto] sm:gap-3 sm:pr-3">
                  <img src={SHOT[l.id]} alt="" className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.p.name}</p>
                    <p className="num text-[13px] text-muted">{l.size} ml · {fmt(l.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => dec(l.id, l.size)} aria-label="Quitar uno" className="grid h-9 w-9 place-items-center rounded-full border border-line"><Minus size={14} /></button>
                    <span className="num w-5 text-center text-sm font-semibold">{l.qty}</span>
                    <button onClick={() => add(l.id, l.size)} aria-label="Agregar uno" className="grid h-9 w-9 place-items-center rounded-full border border-line"><Plus size={14} /></button>
                    <button onClick={() => remove(l.id, l.size)} aria-label={`Eliminar ${l.p.name}`} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-danger"><Trash size={16} /></button>
                  </div>
                </div>
              ))}
              {lines.length > 0 && (
                <div className="space-y-3 pt-2">
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">¿Cómo quieres recibirlo?</legend>
                  <div role="radiogroup" className="grid grid-cols-2 gap-1 rounded-full border border-line bg-bg p-1">
                    {[["envio", "Envío por Starken"], ["presencial", "Presencial"]].map(([v, l]) => (
                      <button key={v} type="button" role="radio" aria-checked={mode === v} onClick={() => { setMode(v); setError(""); }}
                        className={`rounded-full px-2 py-2.5 text-sm font-medium transition-colors ${mode === v ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}>{l}</button>
                    ))}
                  </div>
                </fieldset>
                {mode === "envio" && (
                  <div className="space-y-2.5">
                    <p className="text-sm font-semibold">Datos para el envío</p>
                    {FIELDS.map((f) => (
                      <div key={f.k} className="grid gap-1.5">
                        <label htmlFor={`c-${f.k}`} className="text-xs font-medium text-muted">{f.label}</label>
                        <input id={`c-${f.k}`} value={d[f.k]} onChange={set(f.k)} type={f.type || "text"} inputMode={f.mode} autoComplete={f.auto || "off"} placeholder={f.ph}
                          className="min-w-0 rounded-xl border border-line bg-bg px-3 py-2.5 text-base text-ink outline-none placeholder:text-muted/60 focus:border-accent sm:text-sm" />
                      </div>
                    ))}
                    <p className="text-xs text-muted">El costo del envío se paga aparte y lo coordinamos por Instagram.</p>
                  </div>
                )}
                {mode === "presencial" && <p className="rounded-xl bg-bg px-3 py-2.5 text-sm text-muted">Coordinamos el lugar y la hora de entrega por el chat de Instagram.</p>}
                <label htmlFor="c-msg" className="sr-only">Mensaje del pedido</label>
                <textarea id="c-msg" ref={textRef} readOnly value={message} rows={5}
                  className="w-full resize-none rounded-xl border border-line bg-bg p-3 font-mono text-[12.5px] leading-relaxed text-ink" />
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="space-y-2.5 border-t border-line px-5 py-4">
                <div className="flex items-baseline justify-between"><span className="text-muted">Total sin envío</span><span className="num text-xl font-semibold">{fmt(total)}</span></div>
                {error && <p role="alert" className="text-sm text-danger">{error}</p>}
                <button onClick={copy} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-semibold text-accent-ink transition active:scale-[0.98]"><Copy size={18} />Copiar pedido</button>
                <a href={`https://ig.me/m/${instagram}`} onClick={openInstagram} target="_blank" rel="noopener" className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-3.5 font-semibold transition hover:border-ink"><InstagramLogo size={18} />Copiar y abrir Instagram</a>
                <p className="text-center text-xs text-muted">Se abre @{instagram}. Toca <b className="font-semibold">Mensaje</b> y pega el pedido.</p>
                <button onClick={clear} className="w-full text-center text-xs text-muted underline-offset-2 hover:underline">Vaciar pedido</button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
