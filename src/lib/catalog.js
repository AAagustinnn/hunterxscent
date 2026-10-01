import base from "../data/products.json";

const shots = import.meta.glob("../assets/shots/*.webp", { eager: true, query: "?url", import: "default" });
const ings = import.meta.glob("../assets/ing/*.webp", { eager: true, query: "?url", import: "default" });
const byFile = (map) => Object.fromEntries(Object.entries(map).map(([k, v]) => [k.split("/").pop().replace(".webp", ""), v]));
export const SHOT = byFile(shots);
export const ING = byFile(ings);

export const CATS = ["Todos", "Diseñador", "Nicho", "Árabe"];
export const FAMS = ["Cítrico", "Fresco", "Dulce", "Amaderado", "Especiado", "Floral", "Frutal"];

export const fmt = (n) => "$" + Number(n || 0).toLocaleString("es-CL");

// CSV simple con soporte de comillas (formato de Google Sheets "Publicar en la web").
export function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim() !== ""));
  const keys = (head || []).map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

const toInt = (v) => {
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};
const yes = (v, def = true) => {
  if (v === undefined || v === "") return def;
  const s = String(v).toLowerCase();
  if (["no", "0", "false", "agotado", "n"].includes(s)) return false;
  return true;
};

// Mezcla el catálogo base con la planilla (precios, stock y visibilidad).
export function mergeSheet(products, rows) {
  const map = new Map(rows.map((r) => [r.id, r]));
  return products
    .map((p) => {
      const r = map.get(p.id);
      if (!r) return p;
      return {
        ...p,
        p5: toInt(r.precio_5ml) ?? p.p5,
        p10: toInt(r.precio_10ml) ?? p.p10,
        stock5: yes(r.stock_5ml),
        stock10: yes(r.stock_10ml),
        hidden: !yes(r.visible),
        featured: yes(r.destacado, false),
      };
    })
    .filter((p) => !p.hidden);
}

export async function loadCatalog() {
  let config = { instagram: "hunterxscent", sheetCsvUrl: "" };
  try {
    const r = await fetch("./config.json", { cache: "no-store" });
    if (r.ok) config = { ...config, ...(await r.json()) };
  } catch (e) { /* sin config: se usan los valores por defecto */ }
  let products = base, source = "local";
  if (config.sheetCsvUrl) {
    try {
      const r = await fetch(config.sheetCsvUrl, { cache: "no-store" });
      if (r.ok) { products = mergeSheet(base, parseCSV(await r.text())); source = "sheet"; }
    } catch (e) { /* si la planilla falla se muestra el catálogo base */ }
  }
  return { products, config, source };
}

export const allNotes = (p) => [...p.top, ...p.mid, ...p.base].map((n) => n.n).join(" ");
export const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
