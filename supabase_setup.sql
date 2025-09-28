-- Supabase Schema for Europupis2
-- Ejecutar en Supabase SQL Editor

-- Enable required extensions
create extension if not exists pgcrypto;

-- TASKS
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
alter table public.tasks enable row level security;
create policy tasks_select_own on public.tasks for select using (auth.uid() = user_id);
create policy tasks_insert_own on public.tasks for insert with check (auth.uid() = user_id);
create policy tasks_update_own on public.tasks for update using (auth.uid() = user_id);
create policy tasks_delete_own on public.tasks for delete using (auth.uid() = user_id);

-- EXPENSES
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null default current_date,
  description text not null,
  amount numeric(10,2) not null,
  paid_by text,
  category text,
  created_at timestamptz not null default now()
);
alter table public.expenses enable row level security;
create policy expenses_select_own on public.expenses for select using (auth.uid() = user_id);
create policy expenses_insert_own on public.expenses for insert with check (auth.uid() = user_id);
create policy expenses_update_own on public.expenses for update using (auth.uid() = user_id);
create policy expenses_delete_own on public.expenses for delete using (auth.uid() = user_id);

-- CITIES
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.cities enable row level security;
create policy cities_select_own on public.cities for select using (auth.uid() = user_id);
create policy cities_insert_own on public.cities for insert with check (auth.uid() = user_id);
create policy cities_update_own on public.cities for update using (auth.uid() = user_id);
create policy cities_delete_own on public.cities for delete using (auth.uid() = user_id);

-- CITY NOTES
create table if not exists public.city_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  city_id uuid not null references public.cities(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.city_notes enable row level security;
create policy city_notes_select_own on public.city_notes for select using (auth.uid() = user_id);
create policy city_notes_insert_own on public.city_notes for insert with check (auth.uid() = user_id);
create policy city_notes_update_own on public.city_notes for update using (auth.uid() = user_id);
create policy city_notes_delete_own on public.city_notes for delete using (auth.uid() = user_id);

-- CITY TRANSFERS
create table if not exists public.city_transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  city_id uuid not null references public.cities(id) on delete cascade,
  info text not null,
  created_at timestamptz not null default now()
);
alter table public.city_transfers enable row level security;
create policy city_transfers_select_own on public.city_transfers for select using (auth.uid() = user_id);
create policy city_transfers_insert_own on public.city_transfers for insert with check (auth.uid() = user_id);
create policy city_transfers_update_own on public.city_transfers for update using (auth.uid() = user_id);
create policy city_transfers_delete_own on public.city_transfers for delete using (auth.uid() = user_id);

-- Add additional fields for itinerary
alter table public.cities add column if not exists arrival_datetime timestamptz;
alter table public.cities add column if not exists origin text;

-- Helpful indexes
create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_expenses_user_date on public.expenses(user_id, date desc);
create index if not exists idx_cities_user on public.cities(user_id);
create index if not exists idx_city_notes_city on public.city_notes(city_id);
create index if not exists idx_city_transfers_city on public.city_transfers(city_id);