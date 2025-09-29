# Europupis2

Aplicación Next.js mínima para planificar un viaje por Europa. La interfaz está en español (solo visualización en frontend).

## 🚀 Quick Start

- **Desarrollo**: `npm install` y `npm run dev`
- **Deploy**: importar el repo en Vercel (Next.js auto-detectado)
- **GitHub**: https://github.com/jutopa31/europupis2

## 🛠️ Setup con Supabase (Opcional)

1. Copia `.env.local.example` a `.env.local`
2. Llena las variables con tu proyecto Supabase
3. Las ciudades se sincronizarán automáticamente cuando esté configurado

## 📱 Funcionalidades

- `/` — Cuenta regresiva al viaje (1 Oct 2025, 15:00h)
- `/tasks` — Notas adhesivas (mock + localStorage)
- `/expenses` — Registro de gastos (mock + localStorage)
- `/cities` — Ciudades y traslados (Supabase + localStorage fallback)
  - En “Resumen de itinerario”, haz clic en “Llegada” para editar la fecha y hora en línea.
  - En cada tarjeta de ciudad, usa el icono ✏️ para renombrar la ciudad.
- `/pantu-investiga` — Notas de investigación por ciudad (usa los datos de Ciudades)

Configura la fecha objetivo en `lib/tripConfig.js`.

Consulta `ARCHITECTURE.md` para la estructura y plan de integración con Supabase.

## UI y estilos (Tailwind)

- Tailwind v4 + PostCSS + Autoprefixer configurados (`postcss.config.js` usa el plugin `@tailwindcss/postcss`).
- Componentes UI en `components/ui/`.
- Estilos globales en `app/globals.css` (tokens de tema + utilidades).

Revisa `PHASE3_CHANGES.md` para el listado de cambios recientes.
