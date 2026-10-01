# Riff Sports — regras do projeto

Plataforma esportiva mobile-first (PWA, depois Capacitor) para atletas amadores, organizadores de
eventos e educadores físicos. Lançamento em Porto Alegre. Idade mínima: 18 anos. Interface em
português do Brasil. Plano completo em `docs/PLAN.md`.

## Stack

- Vite 8 + React 19 + TypeScript strict. Alias `@/` aponta para `src/`.
- React Router (modo data, `createBrowserRouter`), TanStack Query, Zustand, React Hook Form + Zod.
- Tailwind CSS v4 + shadcn/ui (`components.json`). Ícones Lucide.
- Supabase: Postgres + PostGIS, Auth, Storage, Realtime, Edge Functions.
- Testes: Vitest + Testing Library (unidade), Playwright (e2e, perfis Android e iPhone).
- Antes de instalar uma biblioteca fora desta lista e do plano, pergunte ao Rodrigo.

## Comandos

```bash
npm run dev          # app em http://localhost:5173
npm run lint && npm run typecheck && npm test
npm run test:e2e     # build + preview + Playwright
npm run format       # Prettier
npm run db:push      # aplica migrações no projeto linkado
npm run db:types     # regenera src/lib/database.types.ts
python scripts/build_sports_seed.py  # regenera supabase/seed.sql
```

## Estrutura

- `src/app/` — providers, rotas, páginas de casca (placeholder, 404, `/design`).
- `src/features/<área>/` — conta, perfil, eventos, descoberta, presença, comunidade. Cada área
  guarda as próprias telas, componentes, hooks e acesso a dados.
- `src/components/ui/` — design system (botão, campo, chip, card). `src/components/layout/` — casca.
- `src/copy/pt-BR.ts` — todos os textos. Nada de texto solto em componente.
- `src/lib/` — cliente Supabase, env, query client, tipos do banco, utilitários.
- `supabase/migrations/` — migrações versionadas. `supabase/seed.sql` é gerado pelo script.

## Design (fonte: Figma "Riff app", Page 2, seções "MVP" e "RIff publico fechado")

- Arquivo `V4pFsk9q0LxI2gFbXJiNh1`. Ignorar Page 3 e "atomic" (só inspiração de cor).
- Tokens em `src/index.css`. Sempre use as classes dos tokens (`bg-brand`, `bg-card`, `text-primary`
  etc.), nunca hex soltos em componente.
- Valores confirmados no Figma: app `#121515`, petróleo `#031D24` (login, cadastro, cabeçalho),
  card `#2B2F30`, chip `#425155`, campo `#3D4344` com borda `#969999`, texto `#EEF3F3`,
  amarelo `#F1D86E` com texto `#232F32`, secundário/desativado `#666666`.
- Fonte Roboto variável; campos usam a largura condensada (`font-condensed`).
- Raios: 4 / 8 / 16 / 20 (cards) / 24 (botões, campos, popups).
- Navegação principal: abas no topo (Eventos, Jogar, Perfil) com indicador amarelo, como no Figma.
- Telas de 430px de largura no Figma: use `max-w-app`.
- Dark-first. Respeitar "reduzir movimento", alvo de toque ≥ 44px, contraste AA.
- Construa uma tela por vez e compare com a captura do Figma antes de seguir.

## Voz do Riff

Frases curtas, segunda pessoa, bem-humoradas sem forçar. Nunca culpar a pessoa, principalmente em
falta e penalidade. Ex.: "Tô dentro", "Lotou! Quer entrar na fila?", "Não consegui salvar agora.
Tenta de novo?".

## Regras que não podem ser quebradas

- **Segredos:** nunca escrever senha do banco, service role key ou chave secreta em código, commit,
  doc ou log. Só em `.env.local` (fora do Git) ou nos secrets das Edge Functions. O front usa apenas a
  chave publicável.
- **RLS em todas as tabelas.** Nenhuma tabela sem política. Dados sensíveis do perfil (nascimento,
  gênero, acessibilidade) só para o dono; os outros leem `public_profiles`.
- **Regras críticas vivem no banco:** vagas, fila, estados do evento e score. O app só pede e mostra.
- Cancelar evento muda o estado, não apaga. Entrar no evento é uma função única que trava a vaga.
- Fora de escopo até as sprints S7–S10: verificação de identidade (CPF/documento/selfie), check-in
  por GPS, mapa e logins sociais.
- Commits pequenos, uma branch por sprint (`sprint-N`), PR para `main` com CI verde.
