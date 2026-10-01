# Riff — Plano do Projeto

30 de set. de 2026 · Rodrigo. Original: https://claude.ai/code/artifact/d43745ff-0ebf-49a8-9342-92a2a812b489

## Visão

O Riff organiza o esporte amador: qualquer pessoa cria, encontra e participa de jogos com gente
confiável, num app com cara de primeira linha e voz de parceiro de jogo. Projeto novo, com
Vite + React + Supabase, lançado como web app instalável e empacotado para Google Play e iOS com
Capacitor.

Diferencial: o que hoje se resolve no WhatsApp (juntar gente, confirmar, cobrar, saber quem aparece)
passa a acontecer num lugar só, com reputação real.

## Decisões tomadas (30/09/2026)

1. Escopo da v1.0: o que o Figma mostra, sem identidade, check-in por GPS, mapa e logins sociais
   (S7 a S10).
2. "MVP" e "Riff público fechado" são as mesmas telas. O modo fechado vira o piloto por convite.
3. Público: educadores físicos com aulas pagas e organizadores de eventos amadores. Pagamento de
   aulas (Pix) sobe de prioridade e deve ser avaliado para antes da S11.
4. Cidade: Porto Alegre, com a lista completa de esportes.
5. Idade mínima: 18 anos.
6. Paleta: fundo petróleo e botão amarelo, confirmados pela cor mais frequente no Figma
   (`#031D24` / `#F1D86E`; o app usa `#121515` nas telas internas).
7. Nome: Riff Sports.

Fonte visual: Figma "Riff app", Page 2, seções "MVP" e "Riff público fechado". Page 3 e "atomic"
ficam de fora ("atomic" só inspira cores).

## Produto em camadas

| Camada                    | O que entra                                                                                                          | Quando       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1. Jogar                  | Conta e perfil, criar e editar evento, participar e sair, lista de espera, Meus Eventos, descoberta, presença, score | Sprints 1–4  |
| 2. Comunidade e segurança | Amigos, grupos, convite por link e QR, chat do evento, denúncias, bloqueio, avaliações                               | Sprint 5     |
| 3. Confiança máxima       | Mapa, check-in por GPS com penalidade, verificação de CPF/documento/selfie, logins sociais                           | Sprints 7–10 |
| 4. Ecossistema            | Atividades pagas com Pix, Riff Pro, locais e arenas, torneios, recompensas                                           | Sprint 11+   |

App nas lojas (Sprint 6) fica entre as camadas 2 e 3.

Acréscimos propostos: criar evento conversando (API do Claude via Edge Function), lista de espera e
quórum mínimo, score suavizado com tendência, convite pelo WhatsApp com prévia, acessibilidade como
filtro e selo, recomendação "Para você", tempo real em vagas e participantes.

## Modelo de negócio

Quem só joga não paga. Receita de quem organiza e de quem recebe jogadores (valores a validar):
taxa sobre atividades pagas via Pix (S11), assinatura Riff Pro para organizadores (S11), locais e
arenas (S12+), marcas e torneios (depois). Lançamento denso numa cidade; meta de liquidez: pelo
menos 3 eventos nos próximos 7 dias num raio de 10 km. Aquisição começa por 20 a 30 organizadores
ativos.

Métricas: estrela-guia = jogos realizados com quórum por semana. Também ativação, taxa de sucesso do
evento, retenção do primeiro mês, no-show, tempo até lotar, uso da lista de espera, convites.

## Experiência e design

Voz: frases curtas, segunda pessoa, bem-humoradas, nunca culpar a pessoa.

| Situação      | Em vez de                    | O Riff diz                                                             |
| ------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Lista vazia   | Nenhum evento encontrado     | Ainda não tem jogo por aqui. Bora criar o primeiro?                    |
| Entrar        | Confirmar participação       | Tô dentro                                                              |
| Lotado        | Evento esgotado              | Lotou! Quer entrar na fila? Se alguém sair, a vaga é sua.              |
| Erro de rede  | Erro 500                     | Não consegui salvar agora. Tenta de novo?                              |
| Evento criado | Evento publicado com sucesso | Pronto, tá no ar! Manda o link pra galera.                             |
| Falta         | Você recebeu uma penalidade  | Hoje não rolou, acontece. Seu Score ajusta e é só aparecer no próximo. |

Design system dark-first, escala de 4px, raios e sombras padronizados, fontes variáveis da Google
Fonts, ícones Lucide. Efeitos: transições entre telas, bottom sheets, micro-interações, vidro só no
topo e na barra, esqueletos de carregamento, atualização otimista, pull-to-refresh. Sempre respeitar
"reduzir movimento", toque ≥ 44px, contraste AA e testar em Android modesto.

## Stack

| Camada               | Escolha                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| Linguagem            | TypeScript strict                                                              |
| App                  | React 19 + Vite 8, PWA                                                         |
| Rotas e dados        | React Router + TanStack Query                                                  |
| Estado e formulários | Zustand, React Hook Form + Zod                                                 |
| Estilo               | Tailwind CSS v4 + shadcn/ui (Radix)                                            |
| Animação             | Motion, Vaul, Sonner, Rive ou Lottie                                           |
| Ícones e fontes      | Lucide, Google Fonts variáveis                                                 |
| Datas                | date-fns em pt-BR                                                              |
| Backend              | Supabase: Postgres + PostGIS, Auth, Storage, Realtime, Edge Functions, pg_cron |
| Nativo               | Capacitor                                                                      |
| Mapa (S7)            | MapLibre GL JS ou Mapbox                                                       |
| IA                   | API do Claude via Edge Function                                                |
| Qualidade            | Vitest, Playwright, ESLint, GitHub Actions                                     |
| Observabilidade      | Sentry e PostHog                                                               |
| Hospedagem           | Vercel ou Cloudflare Pages                                                     |

Vite em vez de Next.js porque o app roda dentro do Capacitor; a prévia de links no WhatsApp sai de
uma Edge Function. Capacitor em vez de React Native para não dobrar o trabalho.

## Arquitetura

Um código React para web e lojas; o resto é Supabase, com regras importantes no banco e chaves dos
serviços externos só em Edge Functions. Repositório por área do produto (`src/features/`), design
system em `src/components/ui/`, textos em `src/copy/`, banco em `supabase/`. Ambientes: local,
homologação e produção. Segurança: RLS em todas as tabelas, CAPTCHA no cadastro, limite de chamadas,
documentos em armazenamento privado, auditoria.

## Banco de dados

| Tabela                                     | O que guarda                                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| profiles                                   | Nome, foto, bio, nascimento, gênero, acessibilidade, verificação, score                      |
| sports, user_sports                        | Catálogo de esportes e nível de cada pessoa                                                  |
| venues                                     | Locais com endereço e coordenadas (PostGIS)                                                  |
| events                                     | Organizador, esporte, local, início com fuso, duração, vagas, mínimo, filtros, preço, estado |
| event_participants                         | Estado (confirmado, na fila, presente, faltou, cancelou) e posição na fila                   |
| peer_confirmations                         | Um jogador confirma que outro esteve no jogo                                                 |
| friendships, groups, group_members         | Amigos e grupos fixos                                                                        |
| blocks, reports                            | Bloqueios e denúncias com fila de moderação                                                  |
| reviews                                    | Avaliações (só quem participou)                                                              |
| notifications, push_tokens, event_messages | Avisos, aparelhos e chat                                                                     |
| verification_requests                      | Verificação sem guardar imagem do documento                                                  |
| payments, subscriptions                    | Pix e Riff Pro (S11)                                                                         |
| audit_log                                  | Ações sensíveis                                                                              |

Regras no banco: entrar no evento é uma função única que trava a vaga ou põe na fila; quem sai
promove o primeiro da fila; job agendado confirma, encerra (2h após o início) e abre avaliação; score
recalculado por gatilho (presenças / jogos concluídos, "Novo" até 3 jogos, tendência dos últimos 10);
evento com estados rascunho, aberto, confirmado, encerrado, avaliado e cancelado; data e hora num
único campo com fuso.

## Integrações

GitHub, Supabase (homologação e produção), Vercel/Cloudflare, Sentry e PostHog (S0); e-mail
transacional e Turnstile (S1); API do Claude (S3); Web Push (S4); contas das lojas e Firebase (S6);
mapa (S7); verificação de identidade via Serpro Datavalid ou revendedor (S9); logins sociais (S10);
Pix com divisão (S11). LGPD desde o início.

## Roadmap

| Sprint | Entrega                                                                                        | Pronto quando                                          |
| ------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 0      | Fundação: repositório, ambientes, design system, esqueleto do app, CI, Sentry e PostHog        | A prévia abre no celular e a publicação é automática   |
| 1      | Conta e perfil: cadastro e login por e-mail, cadastro em passos, perfil, editar, terceiros     | Alguém cria a conta, entra e edita o perfil            |
| 2      | Eventos: criar, editar, cancelar, página do evento, entrar e sair, fila, Meus Eventos          | Evento lotado por contas diferentes sem estourar vagas |
| 3      | Descoberta: Jogar com filtros e calendário, "Para você", criar conversando, convite com prévia | Alguém acha um evento e entra pelo link                |
| 4      | Presença e avisos: presença, confirmação de outro jogador, score, lembretes, push web          | O score muda depois de um jogo avaliado                |
| 5      | Social e segurança: amigos, grupos, QR, chat, denúncias, bloqueio, avaliações                  | Uma denúncia chega à fila de moderação                 |
| 6      | App nas lojas: Capacitor, push nativo, TestFlight e teste interno                              | O app instala nos dois sistemas                        |
| 7      | Mapa                                                                                           | Eventos no mapa dentro do orçamento                    |
| 8      | Check-in por GPS e penalidade com contestação                                                  | Check-in dentro do raio vale presença                  |
| 9      | Identidade e LGPD                                                                              | Conta verificada sem guardar imagem do documento       |
| 10     | Logins sociais                                                                                 | Cada login funciona nos dois sistemas                  |
| 11     | Pix e Riff Pro                                                                                 | Um pagamento Pix é dividido corretamente               |
| 12+    | Locais e arenas, torneios, recompensas, IA ampliada                                            | A definir com os dados do piloto                       |

Marcos: piloto fechado após S4, beta nas lojas após S6, lançamento público após S10.

## Riscos

Poucos eventos e jogadores na mesma cidade (maior risco); escopo crescendo pelas versões do Figma;
Apple recusar "site embrulhado" ou exigir "Entrar com Apple"; LGPD e biometria; segurança ao
encontrar desconhecidos; penalidade injusta por falha de GPS (penalizar só com dois sinais e permitir
contestação); custo de mapas e IA; limite de uso do Claude Pro.

## Fluxo de cada sprint

1. Plano aprovado antes de escrever código.
2. Uma tela por vez, comparando com a captura do Figma.
3. Testes e PR pequena.
4. Prévia testada no celular.
5. Só então a próxima tela.
