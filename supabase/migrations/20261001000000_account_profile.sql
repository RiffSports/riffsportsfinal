-- Sprint 1 — Conta e perfil
-- Campos do cadastro em passos, cadastro concluído só com data de nascimento,
-- visão pública atualizada e armazenamento das fotos de perfil.

-- Perfil ----------------------------------------------------------------------
alter table public.profiles
  add column display_name text check (char_length(display_name) between 1 and 40),
  add column instagram text check (instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  add column onboarded_at timestamptz,
  add constraint profiles_gender_check
    check (gender in ('masculino', 'feminino', 'nao_binario', 'prefiro_nao_informar')),
  add constraint profiles_accessibility_check
    check (accessibility_needs in (
      'nenhuma', 'mobilidade_reduzida', 'cadeirante', 'visual', 'auditiva', 'intelectual', 'outra'
    )),
  -- Revisão da Sprint 0: ninguém entra no app sem data de nascimento (18+ checado no gatilho).
  add constraint profiles_onboarding_requires_birth_date
    check (onboarded_at is null or birth_date is not null);

comment on column public.profiles.display_name is 'Como a pessoa gostaria de ser chamada.';
comment on column public.profiles.onboarded_at is 'Quando o cadastro em passos foi concluído. Nulo = app bloqueado.';

grant update (display_name, instagram, onboarded_at) on public.profiles to authenticated;

-- Visão pública: só perfis com cadastro concluído.
create or replace view public.public_profiles
with (security_barrier = true)
as
  select id, full_name, avatar_url, bio, verification_level, presence_score, created_at,
         display_name, instagram
  from public.profiles
  where onboarded_at is not null;

-- Fotos de perfil -------------------------------------------------------------
-- Bucket público para leitura; cada pessoa só grava na própria pasta ({user_id}/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Dono vê as próprias fotos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Dono envia foto na própria pasta"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Dono troca a própria foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Dono apaga a própria foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
