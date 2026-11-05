# Dívida técnica

| Item | Onde | Motivo | Resolver em |
|---|---|---|---|
| Login simulado (aceita qualquer e-mail/senha válidos; nome derivado do e-mail) | `src/hooks/useSession.ts` | Ainda não há API | Fase 2 (`POST /auth/login`, cookies HttpOnly) |
| Persistência em `localStorage` | `src/hooks/usePersistentState.ts` | Ainda não há banco | Fase 1 (API + Postgres) |
| Total de aulas estimado (dias/semana × 18 semanas) quando o usuário não informa | `src/lib/attendance.ts` | Campo é opcional na UI | Fase 1 (geração de sessions por semestre/feriados) |
| Frequência calculada por contagem de registros + baseline | `src/lib/attendance.ts` | Sem `class_sessions` reais | Fase 1 |
| Tema escuro não implementado | `tailwind.config.ts` | Fora do MVP (V4) | V4 |
| Falta justificada conta como falta (padrão conservador) | `src/lib/constants.ts` (`JUSTIFIED_COUNTS_AS_ABSENCE`) | Regulamento varia por faculdade | Fase 1 (`justified_counts_as_absence` por disciplina/semestre) |
| Aba "Ajustes" é só um ponto de integração (conta e sair) | `src/app/(app)/ajustes/page.tsx` | Fora do escopo da tela "Hoje" | Próxima tela do Figma |
| Simulador fora da barra inferior (o Figma tem 4 abas); acessível por detalhes da aula e calendário | `src/components/layout/BottomNav.tsx` | Segue o Figma | Decidir com o design |
| Selo geral (Seguro/Cuidado/Crítico) da frequência média não existe no Figma da tela "Hoje" | `src/components/home/FrequencySummary.tsx` | Fidelidade ao Figma | Decidir com o design |
| Frequência informada diretamente (`reportedFrequency`) só existe nos dados de exemplo (Cálculo II e Anatomia, sem "aulas dadas"). Registrar presença nelas atualiza faltas e saldo, mas a frequência continua a informada | `src/lib/attendance.ts`, `src/data/demo.ts` | A referência do Figma mostra 85% e 94% sem Total/Dadas; não se deduz aulas dadas de percentual arredondado | Fase 1 (edição de disciplina e contagens reais) |
| Sem estimativa de total de aulas: campo em branco fica "—" e não entra nas contas (a estimativa dias × 18 semanas foi removida por inventar número) | `src/lib/migrate.ts` | Regra "ausente ≠ zero" da tela Disciplinas | — |
| Limite de faltas em branco deriva de 25% do total (mínimo de 75% de presença, `MIN_ATTENDANCE_PCT`), só se o total for informado | `src/lib/attendance.ts` | Padrão do AGENTS.md D2; confirme o regulamento da faculdade | Fase 1 (configuração por semestre) |
| "Semestre selecionado" é global (Hoje, Calendário e Simulador seguem o seletor de Disciplinas) e fica salvo no navegador | `src/hooks/useSubjects.ts` | Uma única fonte de verdade para o semestre | Fase 1 |
| Frequência média geral = média das frequências disponíveis; percentuais arredondados para baixo (74,6% não vira 75%) | `src/lib/attendance.ts`, `src/lib/format.ts` | Bate com a tela "Hoje" (88%) e não esconde risco perto do mínimo | — |
| Simulador "Geral" simula N faltas em CADA disciplina e só considera as que têm aulas dadas e faltas informadas | `src/app/(app)/simulador/page.tsx` | Média das frequências não define "N faltas no total" | Redesenhar com o Figma |
