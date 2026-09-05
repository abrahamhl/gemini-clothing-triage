-- lean ai · Esquema Postgres + RLS + Storage para Supabase
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run.
-- Idempotente en lo razonable; pensado para una primera instalación limpia.

-- ───────────────────────── Perfiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Artículos ─────────────────────────
do $$ begin
  create type public.item_status as enum
    ('pending','analyzing','ready','needs_review','listed','kept','discarded');
exception when duplicate_object then null; end $$;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  status public.item_status not null default 'pending',
  name text not null default 'Artículo sin analizar',
  brand text, model text, category text, size text, material text,
  color text, style text, condition text,
  rarity int, market text, demand text,
  price_liquidation numeric, price_quick numeric,
  price_recommended numeric, price_premium numeric,
  ai_confidence int, ai_description text, opportunity_index int, strategy text,
  ai_raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists items_user_created on public.items (user_id, created_at desc);

create table if not exists public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  ordinal int not null default 0,
  uploaded_from text not null default 'desktop',
  created_at timestamptz not null default now()
);

-- ───────────────────────── Lotes / Anuncios / Auditoría ─────────────────────────
create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null, theme text,
  est_value_individual numeric, est_value_bundled numeric, prob_sale int,
  created_at timestamptz not null default now()
);

create table if not exists public.lot_items (
  lot_id uuid not null references public.lots on delete cascade,
  item_id uuid not null references public.items on delete cascade,
  primary key (lot_id, item_id)
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  item_id uuid references public.items on delete cascade,
  platform text not null,
  title text, body text, keywords text[], price numeric, notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  item_id uuid,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ───────────────────────── RLS: cada usuario solo ve lo suyo ─────────────────────────
alter table public.profiles    enable row level security;
alter table public.items       enable row level security;
alter table public.item_images enable row level security;
alter table public.lots        enable row level security;
alter table public.lot_items   enable row level security;
alter table public.listings    enable row level security;
alter table public.events      enable row level security;

create policy "perfil propio" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "items propios" on public.items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "imagenes propias" on public.item_images
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "lotes propios" on public.lots
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "lote_items propios" on public.lot_items
  for all using (exists (select 1 from public.lots l where l.id = lot_id and l.user_id = auth.uid()));

create policy "anuncios propios" on public.listings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "eventos propios" on public.events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ───────────────────────── Realtime (sync móvil ↔ escritorio) ─────────────────────────
alter publication supabase_realtime add table public.items;

-- ───────────────────────── Storage privado para las fotos ─────────────────────────
insert into storage.buckets (id, name, public)
values ('items', 'items', false)
on conflict (id) do nothing;

-- El usuario solo gestiona archivos dentro de su carpeta: <uid>/...
create policy "fotos propias - leer" on storage.objects
  for select using (bucket_id = 'items' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "fotos propias - subir" on storage.objects
  for insert with check (bucket_id = 'items' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "fotos propias - borrar" on storage.objects
  for delete using (bucket_id = 'items' and (storage.foldername(name))[1] = auth.uid()::text);
