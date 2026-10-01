-- Sprint 0 — Fundação
-- Extensões, perfis (18+) e catálogo de esportes. RLS ligado em tudo.

-- Extensões ------------------------------------------------------------------
create schema if not exists extensions;
create extension if not exists postgis with schema extensions;

-- Utilitário: updated_at -----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Perfis -------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  birth_date date,
  gender text,
  accessibility_needs text,
  verification_level smallint not null default 0 check (verification_level between 0 and 3),
  presence_score numeric(5, 2) check (presence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Um perfil por usuário do Auth. Dados sensíveis só para o dono; os outros veem public_profiles.';
comment on column public.profiles.presence_score is 'Calculado pelo banco (Sprint 4). Nulo = "Novo".';
comment on column public.profiles.verification_level is '0 = e-mail, 1+ = níveis de verificação (Sprint 9).';

-- Idade mínima de 18 anos. Trigger em vez de CHECK porque depende da data atual.
create or replace function public.enforce_min_age()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.birth_date is not null and new.birth_date > (current_date - interval '18 years')::date then
    raise exception 'O Riff é para maiores de 18 anos.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger profiles_min_age
  before insert or update of birth_date on public.profiles
  for each row execute function public.enforce_min_age();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o perfil quando a conta nasce no Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1), 'Jogador')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Dono lê o próprio perfil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Dono atualiza o próprio perfil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Score e verificação só mudam pelo banco: o dono edita apenas estas colunas.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, avatar_url, bio, birth_date, gender, accessibility_needs)
  on public.profiles to authenticated;

-- Visão pública: só o que qualquer jogador logado pode ver de outro.
create view public.public_profiles
with (security_barrier = true)
as
  select id, full_name, avatar_url, bio, verification_level, presence_score, created_at
  from public.profiles;

comment on view public.public_profiles is 'Campos públicos do perfil. Sem nascimento, gênero ou acessibilidade.';

revoke all on public.public_profiles from anon, authenticated;
grant select on public.public_profiles to authenticated;

-- Esportes -------------------------------------------------------------------
create table public.sports (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  category text not null,
  created_at timestamptz not null default now()
);

comment on table public.sports is 'Catálogo de esportes. Novo esporte entra por dado, sem mudar código.';

create index sports_category_idx on public.sports (category);

alter table public.sports enable row level security;

create policy "Catálogo de esportes é público"
  on public.sports for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.sports from anon, authenticated;
