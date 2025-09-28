# Europupis2

Aplicación Next.js mínima para planificar un viaje por Europa. La interfaz está en español (solo visualización en frontend).

- Desarrollo: `npm install` y `npm run dev`
- Deploy: importar el repo en Vercel (Next.js auto-detectado)

Páginas:
- `/` — Cuenta regresiva al viaje
- `/tasks` — Notas adhesivas (mock, persiste en localStorage)
- `/expenses` — Registro de gastos (mock, localStorage)
- `/cities` — Ciudades y traslados (mock, localStorage)

Configura la fecha objetivo en `lib/tripConfig.js`.

Consulta `ARCHITECTURE.md` para la estructura y plan de integración con Supabase.

## UI y estilos (Tailwind)

- Tailwind v4 + PostCSS + Autoprefixer configurados (`postcss.config.js` usa el plugin `tailwindcss`).
- Componentes UI en `components/ui/`.
- Estilos globales en `app/globals.css` (tokens de tema + utilidades).

Revisa `PHASE3_CHANGES.md` para el listado de cambios recientes.
