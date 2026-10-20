# ADR 0001 — Adoção da Arquitetura em Monólito Modular

- **Status:** aceito
- **Data:** 2026-10-19
- **Decisores:** Vitor Aldivan, Antigravity

---

## Contexto
O UniHub é uma plataforma educacional com múltiplos recursos (controle de frequência, calendário de provas, notas, flashcards, upload de arquivos e IA com RAG).
O projeto tem como pilares:
1. Aprendizado de engenharia de software profissional por um desenvolvedor iniciante.
2. Custo zero de infraestrutura e baixa sobrecarga operacional.
3. Entrega rápida e iterativa de valor (MVP de frequência primeiro).

Precisamos definir a estratégia arquitetural inicial para a organização do código e dos serviços.

---

## Opções consideradas

### Opção 1: Arquitetura de Microsserviços
- **Prós:** Cada serviço pode ser escalado e deployado de forma independente.
- **Contras:** Altíssima complexidade de rede, latência entre chamadas, consistência eventual, orquestração de deploys, observabilidade distribuída complexa e alto consumo de memória na máquina de desenvolvimento local. É um dos erros mais comuns de iniciantes, que traz problemas operacionais de empresas gigantes para projetos pequenos.

### Opção 2: Monólito Espaguete (sem divisão de módulos)
- **Prós:** Rápido de começar nos primeiros dias.
- **Contras:** Código acoplado, banco de dados sem limites de contexto, rotas acessando tabelas de outros domínios diretamente. Dificulta muito testes unitários e refatorações futuras.

### Opção 3: Monólito Modular (ESCOLHIDA)
- **Prós:**
  - Código unificado em um único repositório e deploy simples.
  - Baixo consumo de memória e fácil de rodar no computador local com Docker Compose.
  - Separação clara de responsabilidades por módulos de domínio (`auth`, `attendance`, `calendar`, `notes`, `files`, `ai`).
  - Cada módulo encapsula seus modelos, serviços e regras, comunicando-se com outros apenas através de interfaces públicas bem definidas.
  - Se no futuro um módulo específico demandar muita CPU (ex.: processamento de PDFs), ele pode ser extraído para um worker ou microsserviço isolado sem reescrever o restante da aplicação.
- **Contras:** Exige disciplina da equipe para não violar os limites dos módulos.

---

## Decisão
Adotamos o padrão de **Monólito Modular** para o backend da aplicação.
Cada módulo de negócio terá sua pasta dedicada com:
- `domain/`: regras de negócio puras (sem dependência de banco de dados ou frameworks HTTP).
- `services/`: casos de uso e orquestração.
- `repositories/`: camada de acesso ao banco de dados.
- `routers/`: rotas HTTP e validação de requisições.

---

## Consequências
- **Positivas:** Desenvolvimento rápido, testes fáceis de rodar, baixo consumo de recursos da máquina e arquitetura limpa e de fácil manutenção.
- **Negativas:** Requer rigor nas revisões de código (Pull Requests) para garantir que um módulo não importe diretamente repositórios ou tabelas de outro módulo.
- **Quando revisitar:** Quando houver métricas reais em produção indicando gargalo extremo de processamento em um módulo isolado (ex.: geração de embeddings de PDFs).
