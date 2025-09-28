# Supabase Integration

## Resumen
- Conectamos la app a tu proyecto Supabase para la sección de Ciudades.
- Añadimos cliente, variables de entorno y servicios con fallback a mocks si no hay sesión o falla la red.

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
- Base: `db/supabase.schema.sql` (tasks, expenses, cities, city_notes, city_transfers con RLS por `auth.uid()`).
- Campos para itinerario (añadir si no existen):
  - `alter table public.cities add column if not exists arrival_datetime timestamptz;`
  - `alter table public.cities add column if not exists origin text;`
- Ejecuta en Supabase SQL Editor con tu proyecto seleccionado.

## Cliente y servicios
- Cliente: `lib/supabaseClient.js` crea el cliente con las env vars.
- Ciudades: `lib/services/citiesService.js`
  - `listCities()` lee `cities` (+ notas y traslados) y mapea a `{ id, name, from, arrivalDateTime, transfers[], notes[] }`.
  - `createCityNote(cityId, body)` inserta en `city_notes` (requiere sesión).
  - Fallback a mocks si faltan env vars, no hay sesión o hay error.
- UI: `components/CityList.jsx` consume `listCities()` y usa `createCityNote()`.

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
```

## Verificación
- Inicia sesión en la app y visita `/cities`.
- Verás “Resumen de itinerario” con Ciudad, Llegada, Origen y Primer tramo.
- Añadir una nota debe persistir en `city_notes`.

## Próximos pasos
- Migrar `tasks` y `expenses` a Supabase con el mismo patrón.
- Añadir login UI sencillo (email/GitHub) si lo deseas.

