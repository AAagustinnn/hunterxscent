# HUNTER X SCENT · Sitio web

Catálogo de decants (5 y 10 ml) con filtros, fichas de notas, asesor y pedido por Instagram.

## Estructura
```
src/
  App.jsx               Composición de la página y estado global (ficha abierta, carrito, avisos)
  components/           Nav, Hero, Catalog, ProductSheet, CartDrawer, Advisor, HowTo, Faq, Footer, ui
  lib/catalog.js        Carga del catálogo + sincronización con Google Sheets (precios y stock)
  lib/cart.jsx          Carrito (se guarda en el navegador del cliente)
  data/products.json    Catálogo base: notas, duración, estela, precios de respaldo
  assets/shots/         Fotos de producto (una por perfume, id.webp)
  assets/ing/           Fotos de ingredientes
public/config.json      Instagram y enlace a la planilla (se puede editar sin recompilar)
netlify.toml            Configuración de Netlify
```

## Panel de precios y stock (Google Sheets)
Planilla: "HunterXScent Catálogo Web (precios y stock)" en la carpeta de Drive "hunter".
1. Compártela como "Cualquier persona con el enlace: Lector" (Compartir > Acceso general).
2. Edita `precio_5ml`, `precio_10ml`, `stock_5ml`, `stock_10ml` (si/no), `visible` (si/no).
3. La web lee la planilla cada vez que alguien la abre. No hay que volver a subir nada.
No cambies la columna `id`: une cada fila con su foto y sus notas.
Si la planilla no está compartida o falla, la web usa los precios de `data/products.json`.

## Agregar un perfume nuevo
1. Agrega el perfume a `src/data/products.json` (mismo formato que los demás).
2. Agrega su foto en `src/assets/shots/<id>.webp`.
3. Agrega la fila en la planilla con el mismo `id`.
4. Vuelve a publicar (ver abajo).

## Desarrollo y publicación
```
npm install
npm run dev        # vista local
npm run build      # genera dist/ para Netlify
```
Publicar sin instalar nada: arrastra la carpeta `dist` a https://app.netlify.com/drop.
Publicar con GitHub (recomendado a futuro): sube este proyecto a un repositorio y conéctalo en Netlify; cada cambio se publica solo.
