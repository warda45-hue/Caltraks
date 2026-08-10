-- CALTRACK V5 / SUPABASE
-- À exécuter dans Supabase > SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  age integer,
  height_cm numeric,
  weight_kg numeric,
  activity text,
  goal text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- OAuth :
-- Dans Supabase > Authentication > Providers, active Google et Apple.
-- Configure les identifiants OAuth chez Google/Apple puis colle l'URL de callback
-- affichée par Supabase dans les consoles correspondantes.
