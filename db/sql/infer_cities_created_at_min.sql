-- Variante mínima: usa created_at como hora de llegada (sin tocar el esquema)

-- 1) Inserta las que falten
with trips(user_id, name, arrival) as (
  values
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MADRID',               '2025-10-02 14:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'TOLEDO',               '2025-10-03 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BARCELONA',            '2025-10-04 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'PARIS',                '2025-10-06 17:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MONT SAINT MICHEL',    '2025-10-10 09:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BRUJAS',               '2025-10-10 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'GENT',                 '2025-10-11 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'AMSTERDAM',            '2025-10-12 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'LONDRES',              '2025-10-14 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'EDIMBURGO',            '2025-10-18 18:00:00+00'::timestamptz)
)
insert into public.cities (user_id, name, created_at)
select t.user_id, t.name, t.arrival
from trips t
left join public.cities c
  on c.user_id = t.user_id and lower(c.name) = lower(t.name)
where c.id is null;

-- 2) Actualiza created_at de las existentes
with trips(user_id, name, arrival) as (
  values
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MADRID',               '2025-10-02 14:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'TOLEDO',               '2025-10-03 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BARCELONA',            '2025-10-04 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'PARIS',                '2025-10-06 17:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'MONT SAINT MICHEL',    '2025-10-10 09:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'BRUJAS',               '2025-10-10 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'GENT',                 '2025-10-11 15:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'AMSTERDAM',            '2025-10-12 18:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'LONDRES',              '2025-10-14 16:00:00+00'::timestamptz),
    ('5942a276-3f56-4b95-870b-1542aa45c9a4'::uuid,'EDIMBURGO',            '2025-10-18 18:00:00+00'::timestamptz)
)
update public.cities c
set created_at = t.arrival
from trips t
where c.user_id = t.user_id
  and lower(c.name) = lower(t.name);

