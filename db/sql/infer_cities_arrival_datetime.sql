-- Inserta/actualiza ciudades inferidas con hora aproximada de llegada
-- Usa columnas opcionales: arrival_datetime (timestamptz) y origin (text)

-- 1) Asegura columnas opcionales (se crean solo si no existen)
alter table public.cities add column if not exists arrival_datetime timestamptz;
alter table public.cities add column if not exists origin text;

-- 2) Inserta las que falten (comparando por (user_id, name))
with trips(user_id, name, origin, arrival) as (
  values
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MADRID',               null,                 '2025-10-02 14:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'TOLEDO',               'MADRID',             '2025-10-03 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BARCELONA',            'TOLEDO',             '2025-10-04 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'PARIS',                'BARCELONA',          '2025-10-06 17:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MONT SAINT MICHEL',    'PARIS',              '2025-10-10 09:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BRUJAS',               'MONT SAINT MICHEL',  '2025-10-10 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'GENT',                 'BRUJAS',             '2025-10-11 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'AMSTERDAM',            'GENT',               '2025-10-12 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'LONDRES',              'AMSTERDAM',          '2025-10-14 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'EDIMBURGO',            'LONDRES',            '2025-10-18 18:00:00+00'::timestamptz)
)
insert into public.cities (user_id, name, origin, arrival_datetime, created_at)
select t.user_id, t.name, t.origin, t.arrival, coalesce(t.arrival, now())
from trips t
left join public.cities c
  on c.user_id = t.user_id and lower(c.name) = lower(t.name)
where c.id is null;

-- 3) Actualiza las que ya existan (origen/hora de llegada)
with trips(user_id, name, origin, arrival) as (
  values
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MADRID',               null,                 '2025-10-02 14:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'TOLEDO',               'MADRID',             '2025-10-03 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BARCELONA',            'TOLEDO',             '2025-10-04 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'PARIS',                'BARCELONA',          '2025-10-06 17:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MONT SAINT MICHEL',    'PARIS',              '2025-10-10 09:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BRUJAS',               'MONT SAINT MICHEL',  '2025-10-10 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'GENT',                 'BRUJAS',             '2025-10-11 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'AMSTERDAM',            'GENT',               '2025-10-12 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'LONDRES',              'AMSTERDAM',          '2025-10-14 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'EDIMBURGO',            'LONDRES',            '2025-10-18 18:00:00+00'::timestamptz)
)
update public.cities c
set origin = t.origin,
    arrival_datetime = t.arrival,
    created_at = coalesce(t.arrival, c.created_at)
from trips t
where c.user_id = t.user_id
  and lower(c.name) = lower(t.name);

