"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { api } from "@/lib/api";
import { LOGIN_PREFILL } from "@/data/demo";
import { useDemoSubmit } from "@/hooks/useDemoSubmit";
import { validateLogin } from "@/lib/auth-form";
import { AuthField } from "./AuthField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";

interface LoginFormProps {
  initialEmail?: string;
  initialPassword?: string;
  /** Aviso (ex.: depois do cadastro). */
  notice?: string;
  /** Foca a senha ao abrir (o e-mail já veio preenchido). */
  focusPassword?: boolean;
  onForgot: (email: string) => void;
  onSuccess: (email: string, name?: string) => void;
}

/** Introdução + formulário conectado à API e ao banco com fallback gracioso. */
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusPassword) passwordRef.current?.focus();
  }, [focusPassword]);

  // Sem erros na apresentação inicial; depois da 1ª tentativa, atualizam a cada alteração.
  const errors = submitted ? validateLogin({ email, password }) : {};

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setSubmitted(true);
    setApiError(null);

    const found = validateLogin({ email, password });
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();

    setStatus("loading");

    const cleanEmail = email.trim().toLowerCase();
    const res = await api.auth.login({
      email: cleanEmail,
      password,
    });

    if (res.error) {
      setStatus("idle");
      setApiError(res.error);
      return;
    }

    setStatus("done");
    setTimeout(() => {
      onSuccess(cleanEmail, res.data?.user.name);
    }, 400);
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
      {apiError && (
        <div className="mt-4 rounded-xl border border-crit/40 bg-crit-soft p-3 text-xs text-crit">
          {apiError}
        </div>
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
            doneLabel="Entrando no sistema…"
          />
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {status === "loading"
            ? "Entrando…"
            : status === "done"
              ? "Login realizado com sucesso."
              : ""}
        </p>
      </form>
    </div>
  );
}
