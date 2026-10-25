# Progresso do UniHub

- **Fase atual:** 0 — Fundação
- **Última sessão:** 2026-10-25
- **Mentor:** Antigravity (IA)
- **Desenvolvedor:** Vitor Aldivan

---

## ✅ Feito
- [x] Definição e registro do escopo completo do projeto (`docs/SCOPE.md` e `AGENTS.md`).
- [x] Definição de regras inegociáveis (custo zero, padrão de empresa, segurança transversal, sincronização obrigatória com GitHub).
- [x] Alinhamento inicial de objetivos e perfil técnico.
- [x] Diagnóstico do ambiente de desenvolvimento (Git, Node e Python detectados).
- [x] Inicialização do repositório Git local na branch `main`.
- [x] Criação da blindagem do `.gitignore`.
- [x] Criação do `README.md` inicial do projeto.
- [x] Criação do primeiro registro de decisão arquitetural: `docs/adr/0001-monolito-modular.md`.
- [x] Conexão do repositório local ao GitHub remoto e primeiro push concluído com sucesso ([github.com/VitorAldivan/unihub](https://github.com/VitorAldivan/unihub)).
- [x] Governança de código: `.editorconfig`, `.env.example`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
- [x] Estrutura do Monólito Modular: `apps/api` (FastAPI + testes de saúde), `apps/web` (Next.js), `infra/docker/api.Dockerfile`, `docker-compose.yml` e `Makefile`.

## 🔄 Em andamento
- [ ] Preparação do ambiente de containers (WSL2 e Docker Desktop no Windows).

## 🎯 Próximos passos
- [ ] Instalar WSL2 e Docker Desktop.
- [ ] Subir os primeiros containers com `docker compose up -d` (PostgreSQL com pgvector, Redis e API).
- [ ] Validar endpoints de saúde (`/health/live`, `/health/ready`) e documentação Swagger (`/docs`).

## 🚧 Bloqueios / dúvidas
- Nenhum bloqueio no momento.

## 📝 Decisões recentes
- [ADR 0001](adr/0001-monolito-modular.md): Adoção de arquitetura em Monólito Modular em vez de microsserviços.

## 💡 Lições / lembretes para a próxima sessão
- Nunca comitar arquivos com dados sensíveis (`.env`).
- Manter o padrão *Conventional Commits* em todos os envios ao GitHub.
