# Repository Guidelines

## Project Structure & Module Organization
- Next.js (App Router) en JavaScript.
- Rutas en `app/` (`.../page.js`), layout en `app/layout.js`.
- UI en `components/` y elementos reutilizables en `components/ui/`.
- Lógica cliente y mocks en `lib/` (`hooks/`, `mocks/`, `services/`).
- Datos: `db/supabase.schema.sql`. Variables ejemplo en `.env.local.example`.
- Estilos: `app/globals.css` (Tailwind v4) y tokens en `tailwind.config.js`.

## Build, Test, and Development Commands
- Instalar dependencias: `npm install`.
- Desarrollo local: `npm run dev` (http://localhost:3000).
- Build de producción: `npm run build`; ejecutar: `npm start`.

## Coding Style & Naming Conventions
- JS/JSX, indentación 2 espacios, con punto y coma.
- Páginas: `page.js`/`layout.js`; componentes: `PascalCase.jsx`.
- Imports con comillas simples; props JSX con comillas dobles.
- React funcional, componentes pequeños.
- CSS: utilidades Tailwind; evita `@apply` complejo. Usa tokens `text-zinc-*`, `brand.*`.
- La interfaz está en español; mantén copys y accesibilidad en ese idioma.

## Testing Guidelines
- Validación manual recomendada:
  - Home: contador y final “¡Buen viaje!”.
  - Tareas/Gastos/Ciudades: crear/eliminar y persistencia (`useLocalStorage`).
  - Ciudades: “Resumen de itinerario” lista ciudad, llegada y primer tramo.
- Si agregas E2E, usa Playwright en `tests/` (`*.spec.js`).

## Commit & Pull Request Guidelines
- Commits imperativos y concisos (Conventional Commits opcional).
  - Ejemplos: `feat(cities): resumen de itinerario`, `fix(ui): tailwind carga`.
- PRs: descripción clara, issue enlazado, capturas antes/después y notas de prueba.

## Security & Configuration Tips
- No subir `.env.local`. Usa `.env.local.example` como guía.
- Para Supabase: define `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Agent-Specific Instructions
- Mantén los patrones y cambios mínimos.
- Actualiza esta guía/README al cambiar flujos o comandos.

