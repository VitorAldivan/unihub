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
- [x] **Camada de Banco de Dados (SQLAlchemy 2.0):** Conexão com banco (`app/core/database.py`), modelos relacionais (`Course`, `ClassSession`, `AttendanceRecord`) com integridade referencial e constraints de segurança.
- [x] **Schemas e Validação (Pydantic v2):** Modelos de entrada/saída com validação estrita, tipos e documentação OpenAPI.
- [x] **Endpoints HTTP da API (FastAPI):**
  - `POST /api/v1/attendance/simulate`: Simulador de faltas futuras.
  - `POST /api/v1/courses/`: Criação de disciplina e geração automática de sessões.
  - `GET /api/v1/courses/`: Listagem de disciplinas com métricas consolidadas em tempo real.
  - `POST /api/v1/courses/attendance`: Registro de presença/falta em 1 toque.
- [x] **Testes Automatizados:** 21 testes (unitários + integração de API) passando com 100% de sucesso.
- [x] **Documentação Interativa:** Swagger UI ativo e funcionando em `http://localhost:8000/docs`.

## 🔄 Em andamento
- [ ] Inicialização da aplicação Front-end Web em Next.js (TypeScript + Tailwind CSS + PWA).

## 🎯 Próximos passos
- [ ] Criar a base do app Next.js em `apps/web` (App Router, Tailwind CSS, TypeScript).
- [ ] Configurar o PWA (manifest.json, ícones para iPhone/Safari).
- [ ] Construir as telas baseadas no protótipo do Figma: Tela "Hoje" com botões de 1 toque e Tela "Disciplinas".

## 🚧 Bloqueios / dúvidas
- Nenhum bloqueio no momento.

## 📝 Decisões recentes
- [ADR 0001](adr/0001-monolito-modular.md): Adoção de arquitetura em Monólito Modular em vez de microsserviços.

## 💡 Lições / lembretes para a próxima sessão
- Nunca comitar arquivos com dados sensíveis (`.env`).
- Manter o padrão *Conventional Commits* em todos os envios ao GitHub.
- **Regra Inegociável nº 10:** O aluno escreve o código na mão; a IA explica a sintaxe linha por linha, o porquê daquela escolha e como funciona por baixo dos panos.
