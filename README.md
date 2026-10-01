# Riff Sports

O Riff organiza o esporte amador: qualquer pessoa cria, encontra e participa de jogos com gente
confiável.

## Rodar localmente

Requisitos: Node 20+ e npm.

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave publicável do Supabase
npm run dev
```

Abra http://localhost:5173. A vitrine do design system fica em `/design` e mostra se o Supabase
está conectado.

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium   # só na primeira vez
npm run test:e2e
```

## Banco de dados

```bash
npx supabase login
npx supabase link --project-ref <ref-do-projeto>
npx supabase db push --include-seed   # aplica as migrações e carrega os esportes
npm run db:types
```

Regras do projeto em [CLAUDE.md](CLAUDE.md) e plano em [docs/PLAN.md](docs/PLAN.md).
