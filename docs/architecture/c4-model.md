# Arquitetura UniHub — Modelo C4

O **Modelo C4** é uma abordagem padrão na indústria de software para descrever e comunicar a arquitetura de sistemas em diferentes níveis de zoom (como o Google Maps).

---

## 🗺️ Nível 1 — Diagrama de Contexto do Sistema

Mostra o UniHub no centro, quem são os usuários e quais sistemas externos interagem com a plataforma.

```mermaid
graph TD
    User["Estudante Universitário<br/><i>(Usuário do UniHub)</i>"]
    Partner["Usuário Real / Parceiro<br/><i>(Namorada do Estudante)</i>"]
    
    UniHub["UniHub — Plataforma Acadêmica<br/><i>(Monólito Modular Web + API)</i>"]
    
    Gemini["Google AI Studio / Gemini API<br/><i>(LLM & Embeddings para RAG)</i>"]
    MailService["Servidor SMTP / E-mail<br/><i>(Notificações e Lembretes)</i>"]
    
    User -->|"Registra presença, consulta faltas, estuda notas"| UniHub
    Partner -->|"Controla frequência e simula faltas"| UniHub
    
    UniHub -->|"Envia chunks de PDF e prompts para perguntas"| Gemini
    UniHub -->|"Dispara lembretes de provas e entregas"| MailService
```

---

## 📦 Nível 2 — Diagrama de Contêineres

Dá um "zoom" dentro do UniHub e mostra as aplicações, bancos de dados e sistemas de armazenamento que compõem o sistema.

```mermaid
graph TD
    User["Navegador Web / Celular (PWA)"]
    
    subgraph UniHub System
        Web["Front-end Web (Next.js)<br/><i>TypeScript, React, Tailwind, PWA</i>"]
        API["Back-end API (FastAPI)<br/><i>Python 3.12, Pydantic, SQLAlchemy</i>"]
        DB[("Banco de Dados Relacional<br/>PostgreSQL 16 + pgvector")]
        Redis[("Cache & Filas<br/>Redis 7 (Jobs assíncronos)")]
        Storage[("Armazenamento de Arquivos<br/>MinIO (Local) / Cloudflare R2")]
    end
    
    ExtAI["Google Gemini API<br/><i>(LLM externo)</i>"]
    
    User -->|"HTTPS / REST"| Web
    Web -->|"JSON / REST API"| API
    
    API -->|"SQL / pgvector"| DB
    API -->|"Cache / Filas de jobs"| Redis
    API -->|"Upload / Download via S3 API"| Storage
    API -->|"Geração de texto & embeddings"| ExtAI
```

---

## 🏛️ Princípios Arquiteturais Adotados

1. **Monólito Modular:** Todos os domínios do backend coexistem em uma única base de código (`apps/api`), mantendo isolamento estrito entre si através de interfaces públicas (veja o [ADR 0001](../adr/0001-monolito-modular.md)).
2. **Defesa em Profundidade (Cibersegurança):** Acesso a qualquer recurso requer autenticação e autorização por `user_id`. Nenhuma tabela de usuário é exposta diretamente.
3. **Custo Zero:** Todas as dependências de infraestrutura rodam via Docker localmente ou em free tiers sem necessidade de cartão de crédito.
