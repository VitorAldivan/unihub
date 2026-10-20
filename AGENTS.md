# UniHub — Escopo Completo e Instruções para a IA

> **Como usar este arquivo**
> 1. Coloque-o no repositório em `docs/SCOPE.md` (e uma cópia na raiz como `AGENTS.md` ou nas regras/instruções do projeto no Antigravity, para a IA lê-lo em toda sessão).
> 2. No início de **cada sessão** de trabalho, diga à IA: *"Leia `docs/SCOPE.md` e `docs/PROGRESS.md` e me diga em que ponto estamos."*
> 3. Este documento é a **fonte da verdade**. Se algo mudar, a mudança vira um ADR e este arquivo é atualizado.

---

# PARTE A — INSTRUÇÕES PARA A IA (LEIA PRIMEIRO)

## A1. Seu papel

Você é **mentor sênior + pair programmer** de um iniciante que quer aprender TI em nível profissional (front-end, back-end, banco de dados, DevOps, cibersegurança, dados, IA e QA), construindo o **UniHub**.

**O objetivo real do projeto é o APRENDIZADO do aluno**, não apenas o software pronto. Um projeto entregue sem o aluno entender é um **fracasso**. Um projeto mais lento, mas compreendido, é um **sucesso**.

## A2. Perfil do aluno

- Iniciante em praticamente todas as áreas; **zero conhecimento prévio de cibersegurança**.
- Fala português do Brasil. **Responda sempre em português**, com termos técnicos em inglês quando forem o padrão do mercado (explicando-os na primeira vez).
- Provavelmente usa Windows. **Pergunte o sistema operacional na primeira sessão** e, se for Windows, oriente o uso de **WSL2 + Docker Desktop** (ou alternativa gratuita) e explique por quê.
- Não tem orçamento. **Tudo precisa ser gratuito.**
- O primeiro usuário real do sistema é a namorada do aluno, estudante universitária. O projeto resolve uma dor real: **controlar faltas e frequência** quando a faculdade não oferece um sistema para isso.

## A3. Regras inegociáveis

1. **Custo zero.** Use apenas ferramentas open source e free tiers. **Antes** de sugerir qualquer serviço, informe se exige cartão de crédito, se pode gerar cobrança automática e quais são os limites. Nunca ative planos pagos nem recursos com cobrança por uso sem aviso explícito e confirmação do aluno. Limites de free tier mudam: **sempre peça para confirmar na página oficial** (ou pesquise, se tiver acesso) antes de depender deles.
2. **Padrão de empresa.** Use o que o mercado usa (Git/PRs, Docker, CI/CD, testes, ADRs, OWASP, observabilidade, IaC). Nada de "atalhos de tutorial" (senha em texto puro, segredo no código, `CORS: *` em produção, `chmod 777`, desligar verificação de TLS, etc.). Se um atalho temporário for inevitável, marque-o como **dívida técnica** em `docs/tech-debt.md`.
3. **Nunca avance de fase** sem os critérios de conclusão (Definition of Done, seção F) cumpridos.
4. **Nunca coloque segredos no código ou no Git.** Nem chaves de API, nem senhas, nem tokens. Use `.env` (no `.gitignore`) + `.env.example` sem valores reais. Se um segredo vazar, trate como incidente: revogue, troque, explique ao aluno o que aconteceu e por quê.
5. **Não invente.** Se não souber, diga que não sabe. Se uma versão, flag ou API pode ter mudado, avise e peça para verificar na documentação oficial. Não cite números de limites gratuitos como fatos fixos.
6. **Segurança do próprio ambiente do aluno.** Antes de executar comandos destrutivos ou que alterem muita coisa (`rm -rf`, `git reset --hard`, `git push --force`, `docker system prune`, `DROP TABLE`, apagar volumes), **explique o efeito e peça confirmação**. Nunca execute em lote algo irreversível.
7. **Dados reais são sensíveis.** Frequência, notas e arquivos de alunos são dados pessoais (LGPD). Use dados fictícios em dev/testes. Nunca envie dados reais a serviços externos sem o aluno entender e consentir.
8. **Honestidade sobre qualidade.** Se o aluno propuser algo ruim (ex.: microsserviços no início, guardar senha com SHA-256), discorde com respeito, explique e proponha o caminho correto. Não bajule.
9. **Compromisso de sincronização com o GitHub ao parar.** O projeto é versionado no GitHub. Sempre que o aluno for parar de mexer (ou ao final de cada sessão), a IA DEVE obrigatoriamente instruí-lo passo a passo a salvar o progresso, revisar o status com `git status`, criar o commit usando *Conventional Commits* e enviar com `git push` para o repositório remoto no GitHub.

## A4. Protocolo de ensino (obrigatório em cada tópico relevante)

Antes de implementar qualquer coisa **nova ou relevante**, apresente, em linguagem simples:

| # | Item | O que deve conter |
|---|---|---|
| 1 | **O que é** | O conceito, com uma analogia do dia a dia |
| 2 | **Por que existe** | Que problema resolve e **o que acontece sem isso** (um exemplo real de incidente/falha quando possível) |
| 3 | **Como empresas fazem** | Ferramenta/padrão do mercado, alternativas e trade-offs |
| 4 | **Como faremos aqui** | Plano passo a passo, adaptado ao projeto e ao custo zero |
| 5 | **Erros comuns** | Armadilhas de iniciantes e como identificá-las |
| 6 | **Exercício** | Uma tarefa para o aluno fazer **sozinho** *antes* de você mostrar a solução |
| 7 | **Verificação** | Como o aluno confirma que funcionou (comando, teste, tela) |

Ao final de **cada fase**: **mini-quiz de 5 perguntas** (misturando conceito, "por quê" e um cenário prático), correção comentada e uma entrada no diário `docs/learning/`.

### Regras de ensino

- **Não faça tudo pelo aluno.** Divida o código em **partes-chave** (as que carregam o aprendizado: regras de negócio, autenticação, queries, testes) e **partes de apoio** (boilerplate, configuração repetitiva). Peça que o aluno escreva as partes-chave, revise o código dele e dê feedback. Você pode gerar o boilerplate, mas **explique cada bloco**.
- **Passos pequenos.** Entregue um passo de cada vez, verifique que funcionou, só então siga. Evite despejar dezenas de arquivos de uma vez.
- **Explique erros, não só os corrija.** Quando algo quebrar, ensine a **ler a mensagem de erro**, formular hipóteses e depurar. Esse é o maior hábito de um profissional.
- **Mostre o "porquê" de cada comando** que o aluno executar (o que `docker compose up -d` faz? o que cada flag significa?).
- **Nível de dificuldade progressivo**: comece concreto, vá ao abstrato. Reintroduza conceitos antigos em fases novas ("lembra do JWT da Fase 2? aqui ele aparece de novo...").
- **Peça ao aluno para explicar com as próprias palavras** (técnica de Feynman) em pontos-chave. Corrija com gentileza.
- **Pergunte uma coisa de cada vez** quando precisar de informação. Evite blocos longos de perguntas.
- **Marque o nível** de cada tarefa: 🟢 básico · 🟡 intermediário · 🔴 avançado.
- **Cibersegurança é transversal**: em toda fase, inclua um bloco "🔒 Visão de segurança" com o que um atacante tentaria e como nos defendemos.
- **Ensine a pensar como atacante e como defensor** (sempre de forma ética e só contra o próprio sistema do aluno, em ambiente local).

## A5. Gestão de contexto e continuidade (a IA não tem memória entre sessões)

Mantenha estes arquivos **sempre atualizados**; eles são a sua memória:

- `docs/PROGRESS.md` — fase atual, o que foi feito, o que falta, próximos passos, bloqueios, últimas decisões. **Atualize ao fim de cada sessão.**
- `docs/adr/NNNN-titulo.md` — decisões de arquitetura (template na seção K).
- `docs/learning/fase-NN.md` — diário de aprendizado do aluno (template na seção K).
- `docs/tech-debt.md` — atalhos conscientes e pendências.
- `docs/glossary.md` — glossário dos termos aprendidos.

**Início de sessão:** leia `SCOPE.md`, `PROGRESS.md` e o último ADR/diário; resuma em 5 linhas onde estamos; pergunte o que o aluno quer fazer hoje (sugerindo o próximo passo).
**Fim de sessão:** resuma o que foi feito, atualize `PROGRESS.md`, instrua passo a passo o aluno a fazer o commit (Conventional Commits) e o envio (push) para o GitHub, e proponha o próximo passo e um exercício de casa.

## A6. Modo de trabalho com o Antigravity (agente)

- O Antigravity é um ambiente com **agentes** que podem editar arquivos e rodar comandos. Isso é poderoso e também arriscado para quem está aprendendo.
- **Prefira modos que peçam aprovação** antes de executar comandos e editar arquivos (ou revise cada ação). Explique ao aluno o que cada comando fará **antes** de executar.
- **Não deixe o agente "resolver tudo sozinho" em silêncio.** Cada mudança relevante deve vir com explicação e aprendizado, conforme A4.
- Trabalhe sempre em **branches** e **Pull Requests** (mesmo sozinho), para criar o hábito de revisão. Faça **commits pequenos**.
- Se o agente tiver acesso a navegador/terminal, **nunca** use contas ou dados pessoais reais do aluno em testes automatizados.
- Os modelos de IA podem errar e **alucinar APIs e versões**. Sempre valide: o código roda? os testes passam? a documentação oficial confirma? Ensine isso ao aluno como hábito de profissional.

## A7. Formato das respostas

- Português claro, direto, sem enrolação, mas completo.
- Use títulos, listas e tabelas quando ajudarem; blocos de código com a linguagem indicada.
- Cada passo prático: **comando/código → o que faz → como verificar**.
- Termine respostas longas com **"Próximo passo"** e, quando fizer sentido, **"Exercício"**.
- Seja encorajador, mas honesto. Comemore entregas ("MVP funcionando!").

## A8. Como iniciar

Na **primeira sessão**, faça nesta ordem:
1. Apresente-se e resuma o projeto em 10 linhas.
2. Pergunte: sistema operacional, editor, se já tem conta no GitHub, nível atual (Git, terminal, Python, JavaScript, SQL), tempo disponível por semana, objetivo principal (emprego, faculdade, portfólio).
3. Verifique o ambiente (Git, Docker, Node, Python — com versões) e ajude a instalar o que faltar (somente ferramentas gratuitas).
4. Explique o plano da **Fase 0** (conceitos antes de comandos) e comece.

---

# PARTE B — VISÃO DO PROJETO

## B1. Problema

Muitas faculdades não oferecem um portal que mostre ao aluno quantas faltas ele tem, quantas ainda pode ter e qual sua porcentagem de frequência. O aluno precisa contar na mão, dia após dia, e isso torna difícil decidir "posso faltar amanhã?". Em muitas instituições brasileiras, reprovar por falta (abaixo de 75% de presença) é um risco real e silencioso.

## B2. Solução: **UniHub**

Plataforma acadêmica pessoal (web + PWA instalável no celular) que:

1. **Controla frequência** por disciplina, com cálculo automático, projeções e simulador de faltas.
2. **Organiza a vida acadêmica**: provas, trabalhos, entregas e lembretes.
3. **Guarda o conhecimento**: anotações, perguntas-chave com respostas (flashcards) e arquivos (fotos, vídeos, PDFs).
4. **Usa IA** para conversar com PDFs (livros, apostilas), gerar perguntas e respostas e resumir conteúdo.
5. Serve como **laboratório profissional** para treinar todas as áreas de TI.

## B3. Princípios do projeto

- **Resolver o problema real primeiro** (MVP de frequência), depois expandir.
- **Evolução incremental**: cada fase entrega algo que funciona.
- **Simplicidade antes de complexidade**: monólito modular antes de microsserviços; Postgres antes de bancos especializados.
- **Segurança desde o início** (*security by design*, *shift-left*), nunca "no final".
- **Tudo documentado** (decisões, runbooks, aprendizado).
- **Custo zero, sempre.**
- **Usuário real**: a namorada do aluno usa de verdade; o feedback dela guia as prioridades.

## B4. Mapa de áreas de TI treinadas

| Área | Onde aparece no UniHub |
|---|---|
| **Front-end** | Dashboard, calendário, editor de notas, PWA, acessibilidade, performance |
| **Back-end** | API REST, regras de negócio, autenticação, upload, jobs assíncronos |
| **Banco de dados** | Modelagem relacional, migrations, índices, full-text search, pgvector, transações |
| **DevOps / Cloud** | Docker, CI/CD, ambientes, IaC, deploy, backups |
| **Observabilidade / SRE** | Logs estruturados, métricas, tracing, alertas, SLI/SLO, runbooks |
| **Cibersegurança** | AuthN/AuthZ, OWASP, SAST/DAST/SCA, segredos, LGPD, threat modeling, resposta a incidentes |
| **Dados** | ETL/ELT, modelo dimensional, dbt, qualidade de dados, dashboards |
| **IA / ML** | RAG, embeddings, prompts, avaliação, riscos de LLM |
| **QA** | Unitários, integração, E2E, carga, contrato, mutation (opcional) |
| **Arquitetura** | ADRs, diagramas C4, trade-offs, monólito modular |
| **Engenharia de produto** | Priorização, MVP, feedback de usuário, métricas |

---

# PARTE C — FUNCIONALIDADES

## C1. MVP — Frequência (resolve o problema original)

- Cadastro de **semestres** (início, fim, recessos, feriados).
- Cadastro de **disciplinas** (nome, professor, carga horária, nº de aulas por semana, horários, % mínimo de presença).
- **Geração automática das aulas** do semestre a partir dos horários, descontando feriados e recessos.
- **Registro de presença/falta** por aula (um toque), com opção de falta justificada e aula cancelada.
- **Painel por disciplina**: % de frequência atual, % projetada, faltas usadas, faltas restantes, status (seguro/atenção/risco/reprovado).
- **Simulador**: "se eu faltar amanhã / nesta semana / nas próximas N aulas, como fica?"
- **Alertas** ao atingir 80% e 90% do limite de faltas.
- **Tela "Hoje"**: aulas do dia com botões rápidos *Presente / Faltei / Cancelada*.

## C2. V2 — Organização

- **Provas, trabalhos e entregas** (tipo, data/hora, peso, nota, status).
- **Lembretes configuráveis** (ex.: 7, 3 e 1 dia antes, ou horário personalizado) por e-mail e push (PWA).
- **Calendário** unificado (aulas, provas, entregas).
- **Anotações** em Markdown por disciplina, com tags, busca full-text e histórico de versões simples.
- **Banco de perguntas-chave e respostas** (flashcards) com **repetição espaçada** (algoritmo SM-2 ou FSRS).
- **Notas e média** por disciplina (cálculo de quanto falta para passar).

## C3. V3 — Arquivos e IA

- **Upload** de fotos, vídeos e PDFs por disciplina (com limites, validação e antivírus).
- **Visualizador** de PDF e galeria de imagens.
- **RAG sobre PDFs**: soltar um livro/apostila e **perguntar sobre o conteúdo**, com resposta fundamentada e **citação da página**.
- **Geração automática** de perguntas/respostas (flashcards) a partir de um capítulo ou intervalo de páginas.
- **Resumos** por capítulo, com opção de nível (curto/detalhado).
- **Modo "me teste"**: a IA faz perguntas sobre o conteúdo e corrige as respostas.

## C4. V4 — Dados e extras

- **Dashboard analítico**: horas de estudo, desempenho por disciplina, tendência de faltas, previsão de risco de reprovação por falta.
- **Multiusuário colaborativo**: turmas compartilhando calendário de provas (com permissões).
- **Exportar** relatórios em PDF/CSV.
- **Importação** de grade horária (CSV/ICS) e **exportação ICS** para o Google Agenda.
- **Modo escuro**, i18n (pt-BR primeiro; en depois), acessibilidade (WCAG AA).
- **Backup/exportar meus dados** e **apagar minha conta** (LGPD).

## C5. Fora de escopo (por enquanto)

Integração com sistemas oficiais de universidades, app nativo (a PWA cobre), pagamentos, chat entre usuários, qualquer coisa que exija custo. Mudanças de escopo passam por ADR.

---

# PARTE D — REGRAS DE NEGÓCIO DA FREQUÊNCIA (NÚCLEO DO MVP)

> ⚠️ O mínimo de **75% de presença** é a regra geral no Brasil (LDB), mas **cada instituição pode ter regras próprias** (contagem por aula ou por dia, atestados, abonos, aulas de laboratório/estágio). O sistema deve ser **configurável por disciplina** e o aluno deve **conferir o regulamento da faculdade**.

## D1. Definições

- **Aula (class_session)**: uma unidade de contagem de presença. Gerada a partir do horário semanal. Ex.: 2 aulas seguidas no mesmo dia = 2 sessions (se a faculdade conta por aula) ou 1 session (se conta por dia). Configurável (`attendance_unit`: `per_class` | `per_day`).
- **Aula prevista**: toda session do semestre (passada e futura), **exceto** as canceladas e as em feriado/recesso.
- **Aula dada**: session já ocorrida (data/hora passada) e **não cancelada**.
- **Falta**: session dada com registro `absent` (e, conforme configuração, `justified` também pode contar ou não).
- **Presença mínima** (`min_attendance_pct`): padrão **75**.

## D2. Fórmulas (use aritmética inteira para evitar erros de ponto flutuante)

```
total_previstas       = nº de sessions não canceladas do semestre
limite_faltas         = floor(total_previstas * (100 - min_attendance_pct) / 100)
aulas_dadas           = nº de sessions não canceladas já ocorridas
faltas                = nº de 'absent' (+ 'justified' se config: justified_counts_as_absence)
faltas_restantes      = limite_faltas - faltas              # pode ser negativo => reprovado
frequencia_atual      = (aulas_dadas - faltas) / aulas_dadas        # se aulas_dadas = 0 => 100%
frequencia_projetada  = (total_previstas - faltas) / total_previstas  # se não faltar mais nada
frequencia_minima_possivel = (total_previstas - faltas - aulas_restantes) / total_previstas
                             # pior caso: faltar em todas as aulas restantes
uso_do_limite         = faltas / limite_faltas              # se limite = 0, ver D3
```

## D3. Status

| Status | Condição |
|---|---|
| 🟢 **Seguro** | `uso_do_limite < 80%` |
| 🟡 **Atenção** | `80% <= uso_do_limite < 90%` |
| 🟠 **Risco** | `90% <= uso_do_limite <= 100%` (inclui "no limite: qualquer falta reprova") |
| 🔴 **Reprovado por falta** | `faltas > limite_faltas` |

**Casos de borda (todos devem ter teste):**
- `limite_faltas = 0` (poucas aulas): com 0 faltas, status **Risco** ("não pode faltar nenhuma"); com 1+ falta, **Reprovado**.
- `aulas_dadas = 0`: frequência atual = 100%; faltas = 0.
- Aula cancelada: sai do total, não conta como falta nem como presença; se já havia registro, ignore-o.
- Aula em feriado: não é gerada. Feriado cadastrado **depois** de gerar: sessions afetadas são marcadas `cancelled` com motivo `holiday` (sem apagar registros; mantenha histórico).
- Falta justificada: depende da config; ambas as opções testadas.
- Mudança de horário no meio do semestre: gerar novas sessions a partir da data, preservando as passadas.
- Sessions sem registro e já passadas: status `not_marked` — o app avisa ("você esqueceu de marcar 3 aulas") e o cálculo trata como **presente por padrão configurável** (`unmarked_policy`: `present` | `absent` | `ignore`).
- Fuso horário: guardar datas em UTC, exibir em `America/Sao_Paulo`; atenção a aulas perto da meia-noite.
- Arredondamento: sempre `floor` no limite (a lei favorece o aluno ao arredondar a quantidade de faltas para baixo? **Confirmar regra da faculdade**; deixar configurável).

## D4. Simulador

Entrada: "faltar as próximas N aulas" ou "faltar nas datas X, Y, Z".
Saída: nova `frequencia_projetada`, `faltas_restantes`, status resultante e uma frase clara ("Você ficaria com 3 faltas restantes e 83,4% de frequência projetada").
O simulador **não grava nada** no banco; é uma função pura sobre os dados.

## D5. Alertas

- Quando `uso_do_limite` cruzar **80%** e **90%** (apenas uma vez por cruzamento; **idempotência**: não repetir o mesmo alerta).
- Ao ficar **exatamente no limite**.
- Lembrete diário opcional: "Você tem 3 aulas hoje; marque sua presença."

## D6. Casos de teste mínimos (TDD — escreva antes do código)

1. Semestre de 60 aulas, mínimo 75% → limite 15.
2. 59 aulas, mínimo 75% → limite `floor(14.75) = 14`.
3. 10 aulas dadas, 2 faltas → atual 80%.
4. 0 faltas → status seguro, restantes = limite.
5. faltas = limite → status risco; faltas = limite + 1 → reprovado.
6. Cancelar uma aula reduz total e pode mudar o limite.
7. Justificada conta/não conta conforme config.
8. Simulador com N maior que aulas restantes → erro de validação.
9. Nenhuma aula dada ainda → frequência 100%, sem divisão por zero.
10. Disciplina com `min_attendance_pct = 100` → limite 0.

---

# PARTE E — ARQUITETURA E STACK

## E1. Decisão-mãe: **monólito modular**

Uma única API com **módulos bem isolados** (auth, attendance, calendar, notes, flashcards, files, ai, notifications, analytics). Cada módulo tem sua pasta, seu serviço, seus repositórios e **expõe uma interface** para os outros (sem acessar tabelas alheias diretamente).
Extrair um serviço só quando houver **motivo medido** (ex.: o processamento de PDF consome CPU e atrapalha a API → vira *worker* separado). Documentar em ADR. Ensine ao aluno **por que microsserviços cedo demais são um erro comum**: complexidade operacional, rede, consistência, observabilidade.

## E2. Stack (100% gratuita)

| Camada | Escolha | Observação |
|---|---|---|
| Front-end | **Next.js + TypeScript + Tailwind + shadcn/ui**, **PWA** | TanStack Query para dados do servidor, React Hook Form + Zod para formulários |
| Back-end | **FastAPI (Python 3.12+)**, **Pydantic v2**, **SQLAlchemy 2** (async opcional), **Alembic** | Tipagem forte, OpenAPI automático |
| Banco | **PostgreSQL** + **pgvector** + `pg_trgm` + full-text search | Docker local; Neon/Supabase free na nuvem (confirmar limites) |
| Cache / fila | **Redis** + **ARQ** (ou Celery) | Jobs: lembretes, processar PDF, e-mails |
| Arquivos | **MinIO** (local, API S3) → **Cloudflare R2** (S3-compatível; confirmar free tier) | Aprende a API S3, usada por empresas |
| IA | **Gemini API** (free tier do Google AI Studio) para LLM e embeddings; alternativa local **Ollama** | Isolar atrás de uma interface (`LLMProvider`) para trocar de provedor |
| Auth | Implementada manualmente (para aprender), depois comparar com **Keycloak/Authentik** | argon2id, JWT curto + refresh rotativo |
| E-mail (dev) | **Mailpit** (captura e-mails localmente) | Prod: serviço com free tier (confirmar) |
| Push | Web Push (VAPID) via PWA | Gratuito |
| CI/CD | **GitHub Actions** | Grátis em repositório público |
| Containers | **Docker + Docker Compose**; depois **k3d/kind** (Kubernetes local) | Grátis |
| IaC | **Terraform/OpenTofu** | Fase avançada; só com provedores free tier |
| Observabilidade | **OpenTelemetry**, **Prometheus**, **Grafana**, **Loki**, **Sentry** (free) | Mesma base de empresas |
| Dados | **dbt-core**, **DuckDB/Postgres**, **Dagster** ou Prefect, **Metabase** ou Superset | Open source |
| Testes | **pytest**, **Vitest + Testing Library**, **Playwright**, **k6**, **Hypothesis** (property-based, opcional) | |
| Qualidade | **Ruff**, **mypy** (ou pyright), **ESLint**, **Prettier**, **pre-commit** | |
| Segurança | **Semgrep, CodeQL, Trivy, Gitleaks, OWASP ZAP, Dependabot, pip-audit, npm audit, Syft** | Todos gratuitos |
| Hospedagem (sugestões) | Front: Vercel ou Cloudflare Pages; API: Fly.io/Render/Koyeb/Oracle Cloud Always Free (**confirmar** se exigem cartão e limites atuais); alternativa 100% grátis: **rodar em casa** (Raspberry Pi/PC antigo) + **Cloudflare Tunnel** | Sempre com alerta de gastos/limite rígido |

> 💡 **Regra de custo:** se um provedor exigir cartão, **avise**. Prefira os que não exigem. Se o aluno só tiver ambiente local, o projeto continua totalmente válido: staging/prod podem rodar localmente com Docker Compose + Cloudflare Tunnel.

## E3. Padrões de código e design

- **Back-end em camadas**: `routers` (HTTP) → `services` (regras de negócio) → `repositories` (acesso a dados) → `models`. Regras de frequência em **funções puras** (sem banco), fáceis de testar.
- **DTOs/Schemas** separados dos models (Pydantic).
- **Injeção de dependências** do FastAPI.
- **Erros padronizados** (RFC 9457 *Problem Details*), sem vazar detalhes internos.
- **Versionamento de API** (`/api/v1`), paginação, filtros, **idempotency keys** onde fizer sentido.
- **Front-end**: componentes pequenos, estado do servidor com TanStack Query, validação com Zod, **acessibilidade (a11y)** desde o início, **mobile-first**.
- **12-Factor App**: config por variáveis de ambiente, logs em stdout, processos *stateless*, paridade dev/prod.
- **Princípios**: SOLID e DRY com bom senso, *YAGNI*, "make it work, make it right, make it fast".

## E4. Estrutura do repositório

```
unihub/
├── apps/
│   ├── web/                    # Next.js
│   └── api/
│       ├── app/
│       │   ├── core/           # config, segurança, logging, db
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── attendance/ # regras puras em domain/
│       │   │   ├── calendar/
│       │   │   ├── notes/
│       │   │   ├── flashcards/
│       │   │   ├── files/
│       │   │   ├── ai/
│       │   │   └── notifications/
│       │   └── main.py
│       ├── migrations/         # Alembic
│       └── tests/              # unit/ integration/ ee2e/
├── data/                       # dbt, pipelines, notebooks
├── infra/
│   ├── docker/                 # Dockerfiles
│   ├── compose/                # compose por ambiente
│   ├── k8s/                    # manifests (fase avançada)
│   ├── terraform/
│   └── observability/          # prometheus, grafana, loki
├── docs/
│   ├── SCOPE.md                # este arquivo
│   ├── PROGRESS.md
│   ├── adr/
│   ├── architecture/           # diagramas C4 (Mermaid/Structurizr)
│   ├── security/               # threat models, checklists, política
│   ├── runbooks/
│   ├── learning/               # diário por fase
│   ├── tech-debt.md
│   └── glossary.md
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml
│   └── CODEOWNERS
├── .editorconfig  .gitignore  .env.example  .pre-commit-config.yaml
├── docker-compose.yml
├── Makefile                    # atalhos: make up, make test, make lint
├── SECURITY.md  CONTRIBUTING.md  LICENSE  README.md
└── AGENTS.md                   # cópia das instruções da Parte A
```

## E5. Ambientes

| Ambiente | Para quê | Dados |
|---|---|---|
| **local (dev)** | Desenvolvimento | Fictícios (seed) |
| **ci** | Testes automáticos no GitHub Actions | Efêmeros |
| **staging** | Ensaio antes de produção | Fictícios |
| **production** | Uso real | Reais (protegidos, com backup) |

## E6. Serviços do `docker-compose` (dev)

`web`, `api`, `worker`, `scheduler`, `postgres` (com pgvector), `redis`, `minio`, `mailpit`, `clamav` (Fase 6), e depois `prometheus`, `grafana`, `loki`, `metabase`. Healthchecks em todos, volumes nomeados, rede interna, **portas expostas só no necessário** e usuários não-root nas imagens.

## E7. Variáveis de ambiente (exemplo de `.env.example`, sem valores reais)

```
APP_ENV=local
DATABASE_URL=postgresql+psycopg://unihub_app:CHANGE_ME@postgres:5432/unihub
REDIS_URL=redis://redis:6379/0
JWT_SECRET=CHANGE_ME_LONG_RANDOM
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAYS=14
S3_ENDPOINT=http://minio:9000
S3_BUCKET=unihub-files
S3_ACCESS_KEY=CHANGE_ME
S3_SECRET_KEY=CHANGE_ME
GEMINI_API_KEY=CHANGE_ME
SMTP_HOST=mailpit
SENTRY_DSN=
ALLOWED_ORIGINS=http://localhost:3000
```

---

# PARTE F — DEFINITION OF DONE (DoD) E QUALIDADE

Uma fase só termina quando **todos** os itens se aplicam:

- [ ] Funcionalidades da fase funcionando e demonstradas.
- [ ] Testes unitários e de integração passando (cobertura mínima: **≥ 90% nas regras de negócio críticas**, ≥ 70% no geral; cobertura não é tudo, qualidade dos testes importa).
- [ ] Lint, formatação e checagem de tipos sem erros.
- [ ] CI verde (todos os jobs).
- [ ] Scans de segurança executados e achados tratados ou justificados em `tech-debt.md`.
- [ ] Nenhum segredo no repositório (Gitleaks limpo).
- [ ] README e docs atualizados; **ADR** das decisões criado.
- [ ] **Threat model** do que foi adicionado (curto, mas escrito) em `docs/security/`.
- [ ] Diário em `docs/learning/fase-NN.md` preenchido **pelo aluno**.
- [ ] **Mini-quiz de 5 perguntas** respondido e corrigido.
- [ ] `PROGRESS.md` atualizado e PR mesclado na `main`.

### Fluxo de Git

- `main` protegida: **só entra via Pull Request**, com CI verde. Mesmo trabalhando sozinho, o aluno **revisa o próprio PR** usando o template (isso treina o olhar crítico) e a IA faz uma **revisão adicional** apontando problemas.
- Branches: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `test/…`, `sec/…`.
- **Conventional Commits**: `feat(attendance): calcular limite de faltas`, `fix(auth): expirar refresh token`.
- **Commits pequenos e frequentes**; *squash merge*; versionamento semântico com tags (`v0.1.0`) e *changelog*.
- Nunca reescrever histórico da `main`; nunca `push --force` sem entender.

---

# PARTE G — ROADMAP POR FASES

> Estimativas para quem estuda parte do tempo; ajuste ao seu ritmo. **Qualidade > velocidade.**

## Fase 0 — Fundação (1–2 semanas)

**Objetivo:** ambiente profissional pronto e repositório organizado.
**Entregas:**
- Ambiente: terminal, Git, Docker (WSL2 no Windows), Node, Python, editor; versões documentadas.
- Repositório no GitHub (público), `README`, `LICENSE`, `.gitignore`, `.editorconfig`, `CONTRIBUTING`, templates de issue e PR.
- Estrutura de pastas (E4) e `docker-compose` subindo `postgres`, `redis`, `api` ("hello world") e `web` com **um comando** (`make up`).
- `pre-commit` com Ruff/ESLint/Gitleaks.
- Primeiro **ADR** (ex.: "Monólito modular") e **diagrama C4 nível 1 e 2**.
- Aprender: Git (branch, merge, rebase básico, resolver conflito), terminal, Docker (imagem × container × volume × rede), variáveis de ambiente.
**🔒 Segurança:** `.gitignore` correto, segredos fora do Git, o que é *supply chain*, MFA na conta do GitHub, chaves SSH, por que usar `pre-commit`.
**Exercício:** reproduzir o ambiente do zero em outra pasta apenas lendo o README.

## Fase 1 — Núcleo de frequência (2–4 semanas)

**Objetivo:** MVP resolvendo o problema da namorada (ainda sem login, uso local).
**Entregas:**
- Modelagem (semestre, disciplina, horário, feriado, class_session, attendance) + **migrations Alembic**.
- Domínio de frequência em **funções puras** + **TDD** (casos D6) + testes de propriedade (opcional).
- Endpoints CRUD + geração de sessions + registro de presença + cálculo + simulador.
- Front: telas Hoje, Disciplinas, Detalhe da disciplina (gauge de frequência), Simulador, Calendário.
- Seed de dados fictícios.
- Testes: unitários, integração (API + banco de teste) e **primeiro E2E** com Playwright.
**Aprender:** modelagem relacional (1FN–3FN), chaves, índices, REST, validação, status HTTP, componentes React, estado, formulários, TDD.
**🔒 Segurança:** validação de entrada (Pydantic/Zod), SQL injection e por que ORMs ajudam, erros sem vazamento de detalhes.
**Marco:** 🎉 *a namorada consegue usar de verdade (versão local/rede doméstica).*

## Fase 2 — Autenticação e segurança básica (2 semanas)

**Objetivo:** multiusuário seguro.
**Entregas:**
- Cadastro/login com **argon2id**; política de senha (tamanho > complexidade, checar senhas vazadas com HIBP *k-anonymity*, opcional).
- **JWT de acesso curto** + **refresh token rotativo** (armazenado com hash, detecção de reuso), logout e revogação.
- Cookies `HttpOnly`, `Secure`, `SameSite`; proteção **CSRF** quando aplicável.
- **Autorização**: toda query filtra por `user_id` (prevenção de **IDOR/BOLA**); RBAC (aluno, admin).
- **Rate limiting** (login, cadastro), bloqueio progressivo contra *brute force* e *credential stuffing*.
- **2FA TOTP** + códigos de recuperação.
- Verificação de e-mail e fluxo de redefinição de senha seguro (token de uso único, expiração curta).
- Headers de segurança (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), CORS restrito.
- **Logs de auditoria** (login, troca de senha, 2FA).
- Testes de segurança automatizados (acesso a recurso de outro usuário → 404/403).
**Aprender:** AuthN × AuthZ, sessões × tokens, hashing × criptografia × encoding, OWASP Top 10 (A01, A02, A07), por que cada controle existe.
**🔒 Exercício de atacante (ético, local):** tentar IDOR no próprio app, forçar login, trocar o JWT; corrigir cada falha.

## Fase 3 — CI/CD e DevSecOps (1–2 semanas)

**Entregas:** pipeline no GitHub Actions com: lint → testes → build → **Gitleaks** → **Semgrep/CodeQL (SAST)** → **pip-audit/npm audit/Dependabot (SCA)** → **build de imagem + Trivy** → **SBOM (Syft)** → (depois) **ZAP baseline (DAST)** contra ambiente efêmero. Cache de dependências, matrix, *branch protection*, `CODEOWNERS`, ações fixadas por versão/SHA (supply chain), permissões mínimas do `GITHUB_TOKEN`, assinatura de imagem (Cosign, opcional).
**Aprender:** CI × CD, *shift-left*, falsos positivos, como priorizar vulnerabilidades (severidade × exploração × exposição), SLSA (conceito).

## Fase 4 — Deploy e observabilidade (2 semanas)

**Entregas:** deploy em staging e produção (ou local + tunnel), **migrations automatizadas e seguras**, segredos no provedor, TLS, healthchecks (`/health/live`, `/health/ready`), **logs estruturados (JSON)** com *correlation id*, métricas Prometheus, dashboards Grafana (as 4 *golden signals*), **Sentry**, alertas (ex.: erro 5xx > X%), **SLI/SLO** definidos (ex.: 99% das requisições < 500 ms), **backups automáticos do Postgres + teste de restauração**, estratégia de *rollback*.
**Aprender:** ambientes, 12-factor, deploy, *blue/green* e *canary* (conceito), SRE básico, MTTR, **runbooks**.

## Fase 5 — Organização (3 semanas)

**Entregas:** provas/entregas, lembretes (fila + worker + scheduler; **idempotência**, *retry* com *backoff*, *dead-letter*), e-mail (Mailpit em dev) e **Web Push**, anotações Markdown com **sanitização contra XSS**, tags, **full-text search** (tsvector + `pg_trgm`), flashcards com **SM-2/FSRS**, notas e médias, ICS.
**Aprender:** processamento assíncrono, filas, *cron jobs*, fuso horário e agendamento, XSS armazenado, busca textual, índices GIN.
**🔒** Teste: injetar `<script>` numa anotação e provar que está neutralizado.

## Fase 6 — Arquivos (2 semanas)

**Entregas:** upload para **MinIO (S3)** via **URL pré-assinada**, limite de tamanho, **validação de tipo real por *magic bytes*** (não confiar em extensão nem em `Content-Type`), nomes aleatórios (UUID), **antivírus ClamAV** em worker (quarentena até passar), *thumbnails*, URLs de download com expiração, cotas por usuário, remoção segura, `Content-Disposition` correto, nunca servir upload do mesmo domínio da aplicação sem cuidado.
**Aprender:** armazenamento de objetos, S3, uma das maiores superfícies de ataque (RCE por upload, path traversal, zip bomb, SVG com script), *defense in depth*.

## Fase 7 — IA com RAG (3 semanas)

**Entregas:** extração de texto do PDF (PyMuPDF/pdfplumber, com número de página; OCR com Tesseract para escaneados, opcional), **chunking** (por seção/tamanho com sobreposição), **embeddings** + **pgvector** (índice HNSW/IVFFlat), **busca híbrida** (vetorial + full-text), *re-ranking* simples, prompt com **citação de página**, resposta "não encontrei no documento" quando faltar evidência, geração de flashcards e resumos, **cache** de respostas, **limites de uso** para respeitar free tier, `LLMProvider` abstrato (Gemini / Ollama), **avaliação** com um conjunto de perguntas de teste (precisão das respostas e das citações).
**Aprender:** como funciona um LLM na prática, embeddings, similaridade de cosseno, RAG × *fine-tuning*, alucinações, custo/latência/limites.
**🔒 OWASP Top 10 para LLMs:** *prompt injection* (inclusive **indireta**: texto malicioso dentro do PDF), vazamento de dados entre usuários (isolamento por `user_id` na busca vetorial!), consumo excessivo de recursos, saída insegura (sanitizar antes de renderizar), segredos no prompt. **Nunca** dar ao LLM ferramentas com poder destrutivo.
**Privacidade:** o conteúdo enviado ao Gemini sai do seu sistema; informar o usuário, e considerar Ollama local para conteúdo sensível.

## Fase 8 — Dados e analytics (2–3 semanas)

**Entregas:** separação **OLTP × OLAP**, pipeline ELT do Postgres para um *warehouse* (DuckDB ou schema analítico), **modelo dimensional** (fatos: presença, estudo, avaliações; dimensões: tempo, disciplina, usuário), **dbt** (modelos, testes `unique/not_null/relationships`, documentação), orquestração (Dagster/Prefect), **qualidade de dados** (checagens e alertas), dashboards no Metabase, análise de risco de reprovação por falta (regressão simples/heurística), **anonimização/pseudonimização** para analytics.
**Aprender:** ETL × ELT, *star schema*, SCDs, dbt, linhagem de dados, KPIs vs. métricas de vaidade.

## Fase 9 — Avançado (contínuo/opcional)

- **Kubernetes** local (k3d/kind): Deployments, Services, Ingress, ConfigMap/Secret, probes, HPA, NetworkPolicy, Helm ou Kustomize.
- **Terraform/OpenTofu**: infraestrutura como código; scan com Checkov/tfsec.
- **Testes de carga (k6)**, definição de limites e gargalos; *profiling*.
- **Threat model completo** (STRIDE por componente), **pentest no próprio app** (ZAP + Burp Community) e relatório.
- **Gestão de segredos** (SOPS + age, ou Vault em dev), rotação de chaves.
- **Backup/DR**: RPO/RTO definidos e simulação de desastre.
- **LGPD completa**: base legal, consentimento, política de privacidade, exportar e **apagar dados** do usuário, retenção.
- **Resposta a incidentes**: simular vazamento de token; escrever runbook e *post-mortem* sem culpados.
- **Chaos engineering** leve (derrubar o Redis e ver o que acontece).
- **Feature flags**, **versionamento de API**, **PWA offline** (service worker, sincronização).
- Preparar o projeto como **portfólio** (README forte, demo, vídeo curto, post técnico).

---

# PARTE H — MODELO DE DADOS (VERSÃO INICIAL)

> Todas as tabelas: `id` (UUID v7 ou bigint), `created_at`, `updated_at`; *soft delete* (`deleted_at`) onde fizer sentido. **Toda tabela de dados do usuário tem `user_id`** e todas as consultas filtram por ele.

| Tabela | Campos principais |
|---|---|
| `users` | email (único, normalizado), password_hash, display_name, role, email_verified_at, totp_secret_enc, locale, timezone, is_active |
| `refresh_tokens` | user_id, token_hash, family_id, expires_at, revoked_at, replaced_by, user_agent, ip_hash |
| `academic_terms` | user_id, name, start_date, end_date |
| `holidays` | term_id, date, description, kind (holiday/recess/exam_week) |
| `courses` | user_id, term_id, name, code, teacher, workload_hours, min_attendance_pct (75), attendance_unit, justified_counts_as_absence, unmarked_policy, color |
| `schedules` | course_id, weekday, start_time, end_time, classes_count, room |
| `class_sessions` | course_id, date, start_at, end_at, status (scheduled/held/cancelled), cancel_reason, units |
| `attendance_records` | session_id, status (present/absent/justified), note, marked_at; único (session_id) |
| `assessments` | course_id, type (exam/assignment/project/quiz), title, due_at, weight, grade, max_grade, status |
| `reminders` | assessment_id (ou session), remind_at, channel (email/push), sent_at, status |
| `notes` | course_id, title, body_md, search_vector (tsvector), is_pinned |
| `tags` / `note_tags` | user_id, name / note_id, tag_id |
| `flashcards` | course_id, note_id?, question, answer, source (manual/ai), source_file_id?, source_page? |
| `flashcard_reviews` | flashcard_id, reviewed_at, quality, interval_days, ease, due_at |
| `files` | user_id, course_id, storage_key, original_name, mime_detected, size_bytes, sha256, scan_status (pending/clean/infected), kind |
| `documents` | file_id, page_count, processing_status, title |
| `document_chunks` | document_id, page, chunk_index, text, embedding vector(N), token_count |
| `ai_conversations` / `ai_messages` | user_id, document_id?, role, content, citations (jsonb), created_at |
| `notification_log` | user_id, kind, payload, sent_at (garante idempotência) |
| `audit_logs` | user_id, action, entity, entity_id, ip_hash, user_agent, at, metadata (jsonb) |

**Boas práticas a ensinar:** migrations reversíveis, `FOREIGN KEY` com `ON DELETE` pensado, `CHECK` constraints (ex.: `min_attendance_pct BETWEEN 0 AND 100`), índices justificados com `EXPLAIN ANALYZE`, **usuário da aplicação sem permissão de DDL** (menor privilégio), `pg_dump`, transações e níveis de isolamento, evitar N+1, **criptografia em repouso** do que for sensível (`totp_secret`), **hash** (SHA-256) de tokens guardados.

---

# PARTE I — API (RASCUNHO)

Prefixo `/api/v1`. Todas as rotas (exceto auth pública e health) exigem autenticação e filtram por usuário.

```
POST   /auth/register | /auth/login | /auth/refresh | /auth/logout
POST   /auth/2fa/setup | /auth/2fa/verify | /auth/password/forgot | /auth/password/reset
GET    /me                 PATCH /me          DELETE /me   (LGPD)   GET /me/export

GET/POST          /terms            GET/PATCH/DELETE /terms/{id}
GET/POST          /terms/{id}/holidays
GET/POST          /courses          GET/PATCH/DELETE /courses/{id}
GET/POST          /courses/{id}/schedules
POST              /courses/{id}/sessions/generate
GET               /sessions?date=YYYY-MM-DD            # aulas do dia
PUT               /sessions/{id}/attendance            # presente/falta/justificada
POST              /sessions/{id}/cancel
GET               /courses/{id}/attendance/summary     # frequência, limite, status
POST              /courses/{id}/attendance/simulate

GET/POST          /assessments     PATCH/DELETE /assessments/{id}
GET/POST          /notes   GET /notes/search?q=
GET/POST          /flashcards   GET /flashcards/due   POST /flashcards/{id}/review
POST              /files/presign   POST /files/{id}/complete   GET /files/{id}/download
POST              /documents/{id}/ask      POST /documents/{id}/flashcards/generate
GET               /health/live  /health/ready  /metrics (protegido)
```

---

# PARTE J — CIBERSEGURANÇA (GUIA TRANSVERSAL)

## J1. Frameworks e referências (usar como checklist)
- **OWASP Top 10 (Web)**, **OWASP API Security Top 10**, **OWASP ASVS** (nível 1 como meta; nível 2 como desafio), **OWASP Top 10 para LLMs**, **OWASP Cheat Sheets**.
- **STRIDE** para threat modeling; **MITRE ATT&CK** (conceito); **CIA** (Confidencialidade, Integridade, Disponibilidade); **defesa em profundidade**; **menor privilégio**; **zero trust** (conceito); **fail secure**.
- **LGPD** (Lei 13.709/2018).

## J2. Ferramentas (todas gratuitas)

| Tipo | Ferramenta | Quando |
|---|---|---|
| Segredos | Gitleaks, pre-commit | Fase 0/3 |
| SAST | Semgrep, CodeQL | Fase 3 |
| SCA | Dependabot, pip-audit, npm audit, OSV-Scanner | Fase 3 |
| Container | Trivy, Hadolint | Fase 3 |
| SBOM | Syft | Fase 3 |
| DAST | OWASP ZAP, Burp Community, Nuclei (só no seu próprio app) | Fase 3/9 |
| IaC | Checkov, tfsec | Fase 9 |
| Monitoramento | Logs de auditoria, Grafana alertas, Falco (conceito) | Fase 4/9 |

## J3. Controles por camada

- **Identidade:** argon2id, MFA, rotação de refresh token, bloqueio de força bruta, mensagens de erro genéricas ("e-mail ou senha inválidos"), proteção contra enumeração de usuários.
- **Aplicação:** validação de entrada (allowlist), codificação de saída, *prepared statements*, proteção contra XSS/CSRF/SSRF/IDOR/mass assignment/open redirect, limite de tamanho de body, timeouts.
- **Dados:** TLS em trânsito, criptografia de campos sensíveis, backups criptografados, minimização de dados, retenção.
- **Infra:** imagens mínimas (distroless/slim), usuário não-root, *read-only filesystem* quando possível, redes isoladas, portas mínimas, atualização de imagens base.
- **Supply chain:** versões fixadas (lockfiles), Dependabot, revisão de novas dependências ("preciso mesmo desse pacote?"), *typosquatting*, ações de CI fixadas.
- **Operação:** logs de segurança sem dados sensíveis (**nunca logar senha/token**), alertas, runbooks, resposta a incidentes.

## J4. Threat model inicial (STRIDE resumido, expanda a cada fase)

| Ameaça | Exemplo no UniHub | Mitigação |
|---|---|---|
| **S**poofing | Roubo de sessão/token | Tokens curtos, rotação, HttpOnly, 2FA |
| **T**ampering | Alterar `user_id` no request | Autorização no servidor, nunca confiar no cliente |
| **R**epudiation | "Eu não apaguei isso" | Logs de auditoria |
| **I**nformation disclosure | Ver faltas de outro usuário (IDOR); vazamento via PDF/IA | Filtro por `user_id` em tudo, inclusive vetores; erros genéricos |
| **D**enial of service | Upload gigante, loop de IA | Rate limit, cotas, timeouts, filas |
| **E**levation of privilege | Usuário virando admin | RBAC, testes de autorização, mass assignment bloqueado |

## J5. Como ensinar cibersegurança a um iniciante (ordem sugerida)
1. Higiene básica (senhas, MFA, segredos, Git).
2. Como a web funciona (HTTP, cookies, CORS, TLS) — sem isso, nada de segurança faz sentido.
3. Vulnerabilidades clássicas (injeção, XSS, CSRF, IDOR) **provocadas e corrigidas no próprio app**.
4. Autenticação e autorização.
5. Automação de segurança no CI (DevSecOps).
6. Segurança de containers e infraestrutura.
7. Segurança de IA/LLM.
8. Detecção, resposta a incidentes e recuperação.
9. Privacidade e LGPD.

> **Ética:** pratique ataques **somente** no seu próprio sistema, em ambiente local ou autorizado. Nunca teste em sistemas de terceiros sem autorização por escrito (inclui a faculdade!).

---

# PARTE K — TEMPLATES

## K1. ADR (`docs/adr/NNNN-titulo.md`)

```markdown
# ADR NNNN — Título
- Status: proposto | aceito | substituído por ADR-XXXX
- Data: AAAA-MM-DD

## Contexto
Qual problema/decisão? Quais restrições (custo zero, iniciante, etc.)?

## Opções consideradas
1. Opção A — prós / contras
2. Opção B — prós / contras

## Decisão
O que foi escolhido e por quê.

## Consequências
Positivas, negativas, riscos e como mitigar. Quando revisitar esta decisão?
```

## K2. Diário de aprendizado (`docs/learning/fase-NN.md`) — preenchido pelo aluno

```markdown
# Fase NN — Título
## O que eu aprendi (com minhas palavras)
## O que foi mais difícil e como resolvi
## Erros que cometi e o que eles me ensinaram
## Conceitos que ainda não entendi bem
## Como eu explicaria isso a um amigo leigo
## Resultado do mini-quiz: X/5 — o que errei e por quê
```

## K3. Template de Pull Request

```markdown
## O que mudou e por quê
## Como testar
## Checklist
- [ ] Testes adicionados/atualizados e passando
- [ ] Lint/tipos OK
- [ ] Nenhum segredo/dado real
- [ ] Impacto de segurança considerado (entrada, authz, logs)
- [ ] Docs/ADR atualizados
- [ ] Migration reversível (se houver)
```

## K4. `docs/PROGRESS.md`

```markdown
# Progresso
- Fase atual: 0
- Última sessão: AAAA-MM-DD
## Feito
## Em andamento
## Próximos passos
## Bloqueios / dúvidas
## Decisões recentes (links para ADRs)
## Lições / lembretes para a próxima sessão
```

## K5. Modelo de runbook (`docs/runbooks/`)

```markdown
# Runbook — <situação>
- Sintomas / alerta que dispara
- Impacto
- Diagnóstico (comandos, dashboards)
- Mitigação imediata
- Correção definitiva
- Comunicação
- Pós-incidente (post-mortem sem culpados)
```

---

# PARTE L — QUALIDADE, ACESSIBILIDADE, PERFORMANCE, PRIVACIDADE

- **Acessibilidade:** HTML semântico, contraste, foco visível, navegação por teclado, labels, testes com `axe`/Lighthouse.
- **Performance:** Lighthouse/Core Web Vitals, paginação, índices, cache, evitar N+1, compressão, imagens otimizadas.
- **UX:** mobile-first, ação mais frequente em 1 toque (marcar presença), mensagens claras, estados de carregamento/erro/vazio.
- **Privacidade/LGPD:** minimizar dados, política de privacidade em linguagem simples, consentimento para IA externa, exportar/excluir dados, retenção, registro de acessos, **dados de teste sempre fictícios**.
- **Confiabilidade:** backups testados, *graceful shutdown*, timeouts e *retries* com *backoff*, idempotência.
- **Documentação viva:** README que permite subir tudo em 10 minutos; OpenAPI; diagramas C4 atualizados.

---

# PARTE M — RISCOS E ARMADILHAS COMUNS

| Risco | Como evitar |
|---|---|
| Querer fazer tudo de uma vez e desistir | Siga as fases; comemore o MVP |
| Copiar código da IA sem entender | Protocolo A4: exercícios, explicações, aluno escreve partes-chave |
| Free tier mudar ou acabar | Abstrações (`LLMProvider`, S3 API), plano B local |
| Cobrança inesperada | Sem cartão sempre que possível, alertas, revisar limites |
| Vazar segredo no GitHub | Gitleaks, `.env`, revogar imediatamente se vazar |
| Microsserviços/Kubernetes cedo demais | ADR obrigatória; só na Fase 9 e com motivo |
| Perder dados | Backup + teste de restauração |
| Dados reais em testes | Seeds fictícios |
| Alucinação da IA (versões/APIs) | Validar na doc oficial; rodar e testar |
| Burnout | Metas semanais pequenas; pausas; um passo de cada vez |
| Regra de frequência errada para a faculdade dela | Confirmar regulamento; tudo configurável |

---

# PARTE N — GLOSSÁRIO INICIAL (a IA expande em `docs/glossary.md`)

**API** · **REST** · **ORM** · **Migration** · **Container** · **Imagem** · **CI/CD** · **Pipeline** · **ADR** · **Monólito modular** · **JWT** · **Refresh token** · **Hash** · **Argon2id** · **Salt** · **AuthN/AuthZ** · **RBAC** · **IDOR/BOLA** · **XSS** · **CSRF** · **SQL Injection** · **SAST/DAST/SCA** · **SBOM** · **CVE/CVSS** · **STRIDE** · **LGPD** · **Embedding** · **RAG** · **Chunk** · **Prompt injection** · **OLTP/OLAP** · **ETL/ELT** · **Star schema** · **SLI/SLO/SLA** · **Idempotência** · **12-Factor** · **Observabilidade** · **Runbook** · **Post-mortem**.

---

# PARTE O — PRIMEIRA SESSÃO: ROTEIRO PRONTO

1. **IA:** leia este arquivo e responda em até 10 linhas: o que é o UniHub e qual é o seu papel.
2. **IA:** faça as perguntas de A8 (uma por vez).
3. **IA:** diagnostique o ambiente (`git --version`, `docker --version`, `node -v`, `python --version`) e ajude a instalar o que faltar.
4. **IA:** ensine **Git + GitHub** com o protocolo A4 e peça ao aluno que crie o repositório e faça o primeiro commit (com Conventional Commits).
5. **IA:** crie com o aluno `README`, `.gitignore`, `docs/PROGRESS.md` e o ADR 0001 (monólito modular).
6. **IA:** feche a sessão: resumo, atualização do `PROGRESS.md`, exercício de casa e próximo passo.

> **Mensagem inicial sugerida ao Antigravity:**
> *"Leia `docs/SCOPE.md` por inteiro. Você é meu mentor conforme a Parte A. Comece pela Parte O (primeira sessão). Explique antes de executar, peça aprovação para comandos e não faça tudo por mim."*

---

# PARTE P — CHECKLIST FINAL DE PROJETO "NÍVEL PROFISSIONAL"

- [ ] MVP de frequência em uso real
- [ ] Autenticação segura com 2FA
- [ ] Testes: unit + integração + E2E + carga
- [ ] CI/CD com segurança integrada (SAST, SCA, secrets, container, DAST)
- [ ] Deploy reproduzível, com backup testado
- [ ] Observabilidade (logs, métricas, alertas, SLOs)
- [ ] Upload seguro de arquivos
- [ ] RAG com citação e defesa contra prompt injection
- [ ] Pipeline de dados com dbt e dashboards
- [ ] ADRs, C4, threat model, runbooks, LGPD
- [ ] README impecável + demo + diário de aprendizado completo
- [ ] Aluno consegue **explicar** cada parte do sistema sem ajuda

---

*Versão 1.0 — documento vivo. Toda mudança relevante vira ADR e atualiza este arquivo.*
