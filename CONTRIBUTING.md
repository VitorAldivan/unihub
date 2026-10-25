# Guia de Contribuição — UniHub

Bem-vindo ao projeto **UniHub**! Este guia define as práticas e padrões de engenharia adotados no desenvolvimento do projeto.

---

## 🌿 Fluxo de Branches

A branch `main` é protegida e representa o código estável. Qualquer alteração deve ser desenvolvida em uma branch separada e integrada via **Pull Request (PR)**.

Padrão de nomenclatura de branches:
- `feat/nome-da-funcionalidade` (ex.: `feat/attendance-calculation`)
- `fix/descricao-do-bug` (ex.: `fix/session-date-offset`)
- `docs/o-que-mudou` (ex.: `docs/architecture-c4`)
- `chore/tarefa-de-suporte` (ex.: `chore/docker-compose-setup`)
- `test/novos-testes` (ex.: `test/attendance-domain-tests`)
- `sec/melhoria-de-seguranca` (ex.: `sec/rate-limit-login`)

---

## 📝 Conventional Commits

Todas as mensagens de commit devem seguir a convenção [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<escopo>): <descrição no imperativo e em minúsculas>
```

Tipos aceitos:
- **`feat`**: Nova funcionalidade para o usuário.
- **`fix`**: Correção de bug.
- **`docs`**: Mudanças apenas na documentação.
- **`style`**: Formatação, espaços, ponto e vírgula (sem alteração de lógica).
- **`refactor`**: Refatoração de código que não adiciona funcionalidade nem corrige bug.
- **`test`**: Adição ou ajuste de testes.
- **`chore`**: Atualizações de tarefas de build, dependências ou configurações.
- **`sec`**: Melhorias ou correções de segurança.

Exemplo: `feat(attendance): adicionar calculo de limite de faltas`

---

## 🔒 Regras de Segurança Inegociáveis

1. **Nunca comite segredos.** Chaves de API, senhas, tokens e certificados nunca devem ser enviados ao repositório. Use o `.env` localmente (já ignorado pelo `.gitignore`).
2. **Dados fictícios.** Sempre use dados de teste fictícios para testar a aplicação. Nunca utilize informações pessoais reais de alunos nos testes.
