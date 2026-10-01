-- Ajustes da revisão da Sprint 0
-- 1. Nome padrão "Jogador": não expor parte do e-mail em perfil público.
-- 2. "Esporte Paralímpico" sai do catálogo: acessibilidade é atributo do evento, não esporte.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Jogador'));
  return new;
end;
$$;

delete from public.sports where slug = 'esporte-paralimpico';
