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
- [x] Arquitetura documentada: Diagramas C4 Nível 1 e 2 em `docs/architecture/c4-model.md`.
- [x] Blindagem DevSecOps: Pipeline de segurança e linter com `.pre-commit-config.yaml` (Gitleaks + Ruff).
- [x] Otimização e controle de hardware: Arquivo `.wslconfig` configurado com teto de 3 GB de RAM.

## 🔄 Em andamento
- [ ] Teste de subida dos containers com Docker Compose e validação da API.

## 🎯 Próximos passos
- [ ] Iniciar o Docker Desktop (quando for codar) e rodar `docker compose up -d`.
- [ ] Acessar os endpoints da API no navegador (`http://localhost:8000/docs`).
- [ ] Mini-quiz de encerramento da Fase 0 (5 perguntas).

## 🚧 Bloqueios / dúvidas
- Nenhum bloqueio no momento.

## 📝 Decisões recentes
- [ADR 0001](adr/0001-monolito-modular.md): Adoção de arquitetura em Monólito Modular em vez de microsserviços.

## 💡 Lições / lembretes para a próxima sessão
- Nunca comitar arquivos com dados sensíveis (`.env`).
- Manter o padrão *Conventional Commits* em todos os envios ao GitHub.
