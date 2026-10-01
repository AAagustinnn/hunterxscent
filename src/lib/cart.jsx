import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const KEY = "hx_cart_v2";
const Ctx = createContext(null);

function reducer(state, a) {
  const k = a.id && `${a.id}|${a.size}`;
  switch (a.type) {
    case "add": return { ...state, [k]: (state[k] || 0) + 1 };
    case "dec": {
      const n = (state[k] || 0) - 1;
      const next = { ...state };
      if (n <= 0) delete next[k]; else next[k] = n;
      return next;
    }
    case "remove": { const next = { ...state }; delete next[k]; return next; }
    case "clear": return {};
    default: return state;
  }
}

function initial() {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v : {}; }
  catch (e) { return {}; }
}

export function CartProvider({ products, children }) {
  const [items, dispatch] = useReducer(reducer, undefined, initial);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* almacenamiento no disponible */ } }, [items]);
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const lines = useMemo(() => Object.entries(items)
    .map(([k, qty]) => { const [id, size] = k.split("|"); const p = byId[id]; if (!p) return null;
      const price = +size === 5 ? p.p5 : p.p10; return { key: k, id, size: +size, qty, p, price, subtotal: price * qty }; })
    .filter(Boolean), [items, byId]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const value = { lines, count, total, add: (id, size) => dispatch({ type: "add", id, size }),
    dec: (id, size) => dispatch({ type: "dec", id, size }), remove: (id, size) => dispatch({ type: "remove", id, size }),
    clear: () => dispatch({ type: "clear" }) };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
