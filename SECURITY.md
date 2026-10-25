# Política de Segurança — UniHub

A segurança da informação e a privacidade dos dados de estudantes são prioridades centrais no UniHub.

---

## 🔒 Reporte Responsável de Vulnerabilidades

Se você identificar uma vulnerabilidade de segurança neste projeto:
1. **Não abra uma Issue pública** no GitHub detalhando a falha.
2. Envie um e-mail confidencial para o mantenedor do projeto com os detalhes técnicos e passos para reprodução.
3. Aguarde o prazo de análise e correção antes de qualquer divulgação pública.

---

## 🛡️ Diretrizes de Segurança do Projeto

- **Criptografia de Senhas:** Utilizamos exclusivamente **argon2id** para hash de senhas de usuários.
- **Autenticação:** Tokens JWT com tempo de vida curto (15 minutos) e Refresh Tokens rotativos armazenados com hash.
- **Proteção contra IDOR/BOLA:** Todas as consultas e operações filtram estritamente pelo `user_id` autenticado.
- **Varredura Contínua:** Pipelines de CI/CD utilizam Gitleaks para detecção de segredos e Semgrep/Trivy para análise estática de código e containers.
