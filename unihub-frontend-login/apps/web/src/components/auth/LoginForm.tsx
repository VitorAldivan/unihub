"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { LOGIN_PREFILL } from "@/data/demo";
import { useDemoSubmit } from "@/hooks/useDemoSubmit";
import { validateLogin } from "@/lib/auth-form";
import { AuthField } from "./AuthField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";

interface LoginFormProps {
  initialEmail?: string;
  initialPassword?: string;
  /** Aviso (ex.: depois do cadastro de demonstração). */
  notice?: string;
  /** Foca a senha ao abrir (o e-mail já veio preenchido). */
  focusPassword?: boolean;
  onForgot: (email: string) => void;
  onSuccess: (email: string) => void;
}

/** Introdução + formulário, direto sobre o fundo (sem cartão). Validação local e envio demonstrativo. */
export function LoginForm({
  initialEmail,
  initialPassword,
  notice,
  focusPassword,
  onForgot,
  onSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail ?? LOGIN_PREFILL?.email ?? "");
  const [password, setPassword] = useState(initialPassword ?? LOGIN_PREFILL?.password ?? "");
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { status, start } = useDemoSubmit();

  useEffect(() => {
    if (focusPassword) passwordRef.current?.focus();
  }, [focusPassword]);

  // Sem erros na apresentação inicial; depois da 1ª tentativa, atualizam a cada alteração.
  const errors = submitted ? validateLogin({ email, password }) : {};

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return; // sem envio duplicado
    setSubmitted(true);
    const found = validateLogin({ email, password });
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();
    // Demonstração: nada é enviado. A senha nunca sai deste componente.
    start(() => onSuccess(email.trim()));
  }

  return (
    <div className="mt-7">
      <h2 className="text-[22px] font-semibold leading-snug">Bom ter você por aqui.</h2>
      <p className="mt-[5px] text-[13px] text-ink-soft">Entre para acompanhar suas aulas e faltas.</p>
      {notice && (
        <p role="status" className="mt-3 text-xs leading-relaxed text-brand">
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Entrar no UniHub" className="mt-5">
        <AuthField
          label="E-mail"
          icon={Mail}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="lucas.silva@aluno.edu.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          readOnly={status !== "idle"}
          inputRef={emailRef}
        />

        <div className="mt-[18px]">
          <PasswordField
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="current-password"
            readOnly={status !== "idle"}
            inputRef={passwordRef}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onForgot(email.trim())}
            className="flex min-h-11 items-center text-xs font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Esqueci minha senha
          </button>
        </div>

        <div className="mt-[18px]">
          <SubmitButton
            status={status}
            idleLabel="Entrar no UniHub"
            loadingLabel="Entrando…"
            doneLabel="Entrada de demonstração"
          />
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {status === "loading"
            ? "Entrando…"
            : status === "done"
              ? "Entrada de demonstração concluída. Nenhuma autenticação real foi feita."
              : ""}
        </p>
      </form>
    </div>
  );
}
