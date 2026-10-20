# UniHub 🎓

> Plataforma acadêmica pessoal com controle inteligente de faltas e frequência, organização de estudos e inteligência artificial para apoio ao aprendizado.

[![Status](https://img.shields.io/badge/Status-Fase%200%20(Funda%C3%A7%C3%A3o)-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

---

## 📌 Sobre o Projeto

O **UniHub** nasceu para resolver um problema real enfrentado por universitários: a falta de ferramentas transparentes para controle de faltas e presença. No Brasil, o limite legal de faltas (mínimo de 75% de presença) é um risco constante que gera ansiedade ao longo do semestre.

O UniHub permite:
- 📊 **Cálculo e Projeção de Frequência:** saiba exatamente quantas faltas ainda pode ter por disciplina e simule ausências futuras.
- 📅 **Organização Acadêmica:** controle de datas de provas, trabalhos, notas e cálculo de médias.
- 🧠 **Flashcards e Repetição Espaçada:** fixação de conteúdo com algoritmo baseado em evidências científicas.
- 🤖 **IA com RAG (Retrieval-Augmented Generation):** converse com livros e apostilas em PDF com citação da página da resposta.

Além de atender a usuários reais no dia a dia, o UniHub é construído com **padrão de engenharia profissional de software**, servindo como laboratório de aprendizado prático de ponta a ponta.

---

## 🛠️ Stack Tecnológica (100% Custo Zero)

- **Front-end:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui, PWA
- **Back-end:** FastAPI (Python), Pydantic v2, SQLAlchemy 2, Alembic
- **Banco de Dados:** PostgreSQL + pgvector
- **Cache e Filas:** Redis + ARQ
- **Armazenamento de Arquivos:** MinIO (local compatível com API S3)
- **DevOps & Qualidade:** Docker Compose, GitHub Actions, Pytest, Playwright
- **Segurança:** OWASP Top 10, argon2id, JWT rotativo, Gitleaks, Semgrep, Trivy

---

## 🏗️ Arquitetura

O projeto adota uma arquitetura de **Monólito Modular** (veja o [ADR 0001](docs/adr/0001-monolito-modular.md)). Todos os módulos residem em um único repositório e processo, mas com limites claros entre domínios (frequência, notas, autenticação, arquivos, IA).

---

## 🚀 Como Executar Localmente

*(Instruções em construção — Fase 0)*

---

## 📖 Documentação do Projeto

- [Escopo e Regras do Projeto](docs/SCOPE.md)
- [Diário de Progresso](docs/PROGRESS.md)
- [Registros de Decisão de Arquitetura (ADRs)](docs/adr/)
