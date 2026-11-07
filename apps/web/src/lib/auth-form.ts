// Validação local das telas de acesso. Só o necessário para a demonstração:
// no login NÃO há regra de criação de senha (símbolo, tamanho mínimo etc.).

/** Um @, sem espaços, com ponto no domínio. Não restringe domínios (ex.: só acadêmicos). */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MSG = {
  emailEmpty: "Informe seu e-mail.",
  emailInvalid: "Digite um e-mail válido.",
  passwordEmpty: "Informe sua senha.",
  passwordCreate: "Crie uma senha.",
  nameEmpty: "Informe seu nome.",
} as const;

export function validateEmail(raw: string): string | undefined {
  const email = raw.trim(); // espaços nas pontas são ignorados
  if (!email) return MSG.emailEmpty;
  if (!EMAIL_RE.test(email)) return MSG.emailInvalid;
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password.length === 0) return MSG.passwordEmpty;
  if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  return undefined;
}

export interface LoginValues {
  email: string;
  password: string;
}
export type LoginErrors = Partial<Record<"email" | "password", string>>;

export function validateLogin(v: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  const email = validateEmail(v.email);
  if (email) errors.email = email;
  // A senha NUNCA é alterada: sem trim, espaços contam como parte dela.
  if (v.password.length === 0) errors.password = MSG.passwordEmpty;
  return errors;
}

export interface SignupValues {
  name: string;
  email: string;
  password: string;
}
export type SignupErrors = Partial<Record<"name" | "email" | "password", string>>;

export function validateSignup(v: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  if (!v.name.trim()) errors.name = MSG.nameEmpty;
  const email = validateEmail(v.email);
  if (email) errors.email = email;
  if (v.password.length === 0) errors.password = MSG.passwordCreate;
  return errors;
}
