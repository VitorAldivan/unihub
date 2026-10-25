# Progresso do UniHub

- **Fase atual:** 1 — Núcleo de Frequência
- **Última sessão:** 2026-10-25
- **Mentor:** Antigravity (IA)
- **Desenvolvedor:** Vitor Aldivan

---

## ✅ Feito
- [x] Definição e registro do escopo completo do projeto (`docs/SCOPE.md` e `AGENTS.md`).
- [x] Definição de regras inegociáveis (custo zero, padrão de empresa, segurança transversal, sincronização obrigatória com GitHub, código escrito na mão pelo aluno).
- [x] Alinhamento inicial de objetivos e perfil técnico.
- [x] Diagnóstico do ambiente de desenvolvimento (Git, Node e Python detectados).
- [x] Inicialização do repositório Git local na branch `main`.
- [x] Criação da blindagem do `.gitignore`.
- [x] Criação do `README.md` inicial do projeto.
- [x] Criação do primeiro registro de decisão arquitetural: `docs/adr/0001-monolito-modular.md`.
- [x] Conexão do repositório local ao GitHub remoto e primeiro push concluído com sucesso ([github.com/VitorAldivan/unihub](https://github.com/VitorAldivan/unihub)).
- [x] Governança de código: `.editorconfig`, `.env.example`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
- [x] Estrutura do Monólito Modular: `apps/api` (FastAPI + testes de saúde), `apps/web` (Next.js), `infra/docker/api.Dockerfile`, `docker-compose.yml` e `Makefile`.
- [x] Arquitetura documentada: Diagramas C4 Nível 1 e 2 em `docs/architecture/c4-model.md`.
- [x] Blindagem DevSecOps: Pipeline de segurança e linter com `.pre-commit-config.yaml` (Gitleaks + Ruff).
- [x] Otimização e controle de hardware: Arquivo `.wslconfig` configurado com teto de 3 GB de RAM.
- [x] **Domínio de Frequência (Fase 1):** Regras puras de cálculo de limite de faltas, semáforo de status (`SAFE`, `WARNING`, `RISK`, `FAILED`), resumo consolidado e simulador de faltas futuras implementados em `apps/api/app/modules/attendance/domain/calculator.py`.
- [x] **Testes Automatizados:** 13 testes unitários com pytest passando em 0.08s cobrindo 100% dos cenários e casos de borda.

## 🔄 Em andamento
- [ ] Criação dos Schemas de validação com Pydantic v2 e endpoints da API FastAPI para o cálculo e simulador.

## 🎯 Próximos passos
- [ ] Implementar Schemas Pydantic (`AttendanceSummaryResponse`, `SimulateAbsenceRequest`, `SimulationResultResponse`).
- [ ] Criar o router HTTP da API (`POST /api/v1/attendance/simulate`).
- [ ] Testar a API via Swagger (`/docs`) e testes de integração com `TestClient`.
- [ ] Modelagem de banco de dados e migrations com Alembic (Postgres).

## 🚧 Bloqueios / dúvidas
- Nenhum bloqueio no momento.

## 📝 Decisões recentes
- [ADR 0001](adr/0001-monolito-modular.md): Adoção de arquitetura em Monólito Modular em vez de microsserviços.

## 💡 Lições / lembretes para a próxima sessão
- Nunca comitar arquivos com dados sensíveis (`.env`).
- Manter o padrão *Conventional Commits* em todos os envios ao GitHub.
- **Regra Inegociável nº 10:** O aluno escreve o código na mão; a IA explica a sintaxe linha por linha, o porquê daquela escolha e como funciona por baixo dos panos.
