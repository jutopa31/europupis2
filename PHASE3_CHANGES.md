# Phase 3 — Cambios de mejora UI

Este documento lista los cambios aplicados para mejorar la UI/UX.

## Resumen

- Tailwind CSS con PostCSS/Autoprefixer
- Componentes UI compartidos (Button, Input, Textarea)
- Sustitución de estilos inline por utilidades coherentes
- Mejora de layout, tipografía y accesibilidad (focus rings, labels)
- Navegación con `next/link`
- Localización: textos de la interfaz traducidos al español (solo frontend)

## Archivos añadidos

- `tailwind.config.js`
- `postcss.config.js`
- `components/ui/Button.jsx`
- `components/ui/Input.jsx`
- `components/ui/Textarea.jsx`
- `PHASE3_CHANGES.md` (este archivo)

## Archivos modificados

- `package.json` — devDependencies (Tailwind, PostCSS, Autoprefixer)
- `postcss.config.js` — usa `tailwindcss` plugin (v4)
- `next.config.js` — `outputFileTracingRoot` para evitar raíz errónea
- `app/globals.css` — tokens de tema, utilidades; se eliminaron `@apply` problemáticos
- `app/layout.js`, `app/page.js` — copys en español
- `app/tasks/page.js`, `app/expenses/page.js`, `app/cities/page.js` — títulos y descripciones en español
- `components/TasksList.jsx`, `components/StickyNote.jsx` — UI de notas en español
- `components/ExpenseList.jsx` — formulario/listado en español, símbolos `€`
- `components/CityCard.jsx` — etiquetas “Transporte/Notas”, vacíos en español
- `components/CountdownTimer.jsx` — “Europupis comienza en…”, “¡Buen viaje!”

## Notas de ejecución

1) Instalar dependencias: `npm install`
2) Ejecutar: `npm run dev` (http://localhost:3000)

Tailwind ya está configurado; no se requieren pasos extra.
