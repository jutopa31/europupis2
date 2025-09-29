# Supabase Integration

## Resumen
- Conectamos la app a tu proyecto Supabase para la sección de Ciudades.
- Añadimos cliente, variables de entorno y servicios con fallback a mocks si no hay sesión o falla la red.
- Nueva tabla `research_notes` para notas libres usadas en “Pantu Investiga”.

## Requisitos
- Node.js instalado.
- Proyecto Supabase activo con Auth habilitado (Email/GitHub).

## Variables de entorno
- Archivo: `.env.local`
  - `NEXT_PUBLIC_SUPABASE_URL=https://izxhrmlnlrfhdcgwmeyq.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=…Dyk`
- Ejemplo actualizado en: `.env.local.example`.

## Instalación
- Instala SDK: `npm i @supabase/supabase-js`
- Ejecuta: `npm run dev` (http://localhost:3000)

## Esquema y RLS
- Base: `db/supabase.schema.sql` (tasks, expenses, cities, city_notes, city_transfers, research_notes con RLS por `auth.uid()`).
- Campos para itinerario (añadir si no existen):
  - `alter table public.cities add column if not exists arrival_datetime timestamptz;`
  - `alter table public.cities add column if not exists origin text;`
- Ejecuta en Supabase SQL Editor con tu proyecto seleccionado.

## Cliente y servicios
- Cliente: `lib/supabaseClient.js` crea el cliente con las env vars.
- Ciudades: `lib/services/citiesService.js`
  - `listCities()` lee `cities` (+ notas y traslados) y mapea a `{ id, name, from, arrivalDateTime, transfers[], notes[] }`.
  - `createCityNote(cityId, body)` inserta en `city_notes` (requiere sesión).
  - Importante: ya no se usan ciudades mock como fallback; si no hay sesión o falla la red, devuelve `[]`.
- UI: `components/CityList.jsx` consume `listCities()` y usa `createCityNote()`.
  - El almacenamiento local migra a la clave `europupis-cities-v2` para evitar semillas mock antiguas.
  - Si ves datos antiguos, borra el `localStorage` de la app.

- Notas de investigación: `lib/services/researchService.js`
  - `listResearchNotes()`, `createResearchNote(body)`, `deleteResearchNote(id)`.
  - UI en `components/ResearchBoard.jsx` (ruta `/pantu-investiga`). Muestra una nota adhesiva con el conteo de ciudades y permite crear notas de texto libre.

## Autenticación
- Activa Email Magic Link o GitHub en Supabase → Auth.
- Configura `Site URL` (p. ej., `http://localhost:3000`).
- La RLS exige usuario autenticado para leer/escribir tus filas.

## Semillas rápidas (SQL)
```sql
insert into public.cities (user_id, name, origin, arrival_datetime)
values (auth.uid(), 'Paris', 'CDG', '2025-05-12T10:30:00+02:00');
-- Usar el id devuelto para relacionar
insert into public.city_transfers (user_id, city_id, info)
values (auth.uid(), '<city_id>', 'CDG → RER B → Gare du Nord');
insert into public.city_notes (user_id, city_id, body)
values (auth.uid(), '<city_id>', 'Reservar franja del Louvre');

-- Notas libres de investigación
insert into public.research_notes (user_id, body)
values (auth.uid(), 'Ideas sueltas y pendientes de investigar');
```

## Verificación
- Inicia sesión en la app y visita `/cities`.
- Verás “Resumen de itinerario” con Ciudad, Llegada, Origen y Primer tramo.
- Añadir una nota debe persistir en `city_notes`.

## Próximos pasos
- Migrar `tasks` y `expenses` a Supabase con el mismo patrón.
- Añadir login UI sencillo (email/GitHub) si lo deseas.

## Importar traslados desde CSV
- Origen: `public/ExportBlock-*/PUPITRASLADOS *.csv` (archivo exportado).
- Conversión: ejecuta `python3 scripts/convert_transfers.py` o `npm run convert:traslados`.
- Se generan tres archivos en `db/import/`:
  - `cities_import.csv` → tabla `public.cities` (columnas: `id,user_id,name`).
  - `city_transfers_import.csv` → tabla `public.city_transfers` (`id,user_id,city_id,info`).
  - `expenses_import.csv` (opcional) → tabla `public.expenses` (`id,user_id,date,description,amount,category,paid_by`).

Importación en Supabase (orden recomendado):
- 1) Sustituye `REPLACE_WITH_USER_ID` por tu UUID (Auth → Users → copia el `id`).
- 2) Table Editor → `cities` → Import data → selecciona `db/import/cities_import.csv` y mapea columnas.
- 3) Table Editor → `city_transfers` → Import data → selecciona `db/import/city_transfers_import.csv`.
- 4) (Opcional) Table Editor → `expenses` → Import data → selecciona `db/import/expenses_import.csv`.

Notas:
- Los `id` de ciudades se generan de forma determinista para poder referenciarlos en `city_transfers` al importar.
- El script sanea precios (formato `€12.34`) y fechas (`October 2, 2025` → `2025-10-02`).
