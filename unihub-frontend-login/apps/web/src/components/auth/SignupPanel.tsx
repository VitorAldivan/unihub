"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail, User } from "lucide-react";
import { useDemoSubmit } from "@/hooks/useDemoSubmit";
import { validateSignup } from "@/lib/auth-form";
import { AuthField } from "./AuthField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";

/** Cadastro SIMPLES e demonstrativo: valida, simula e devolve ao "Entrar". Nenhuma conta real é criada. */
export function SignupPanel({ onCreated }: { onCreated: (email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { status, start } = useDemoSubmit();

  const errors = submitted ? validateSignup({ name, email, password }) : {};

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setSubmitted(true);
    const found = validateSignup({ name, email, password });
    if (found.name) return nameRef.current?.focus();
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();
    start(() => onCreated(email.trim()));
  }

  return (
    <div className="mt-7">
      <h2 className="text-[22px] font-semibold leading-snug">Crie sua conta.</h2>
      <p className="mt-[5px] text-[13px] text-ink-soft">Cadastro de demonstração: nenhuma conta real é criada.</p>

      <form onSubmit={handleSubmit} noValidate aria-label="Criar conta no UniHub" className="mt-5">
        <AuthField
          label="Nome"
          icon={User}
          name="name"
          autoComplete="name"
          placeholder="Como devemos te chamar?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          readOnly={status !== "idle"}
          inputRef={nameRef}
        />
        <div className="mt-[18px]">
          <AuthField
            label="E-mail"
            icon={Mail}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
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
        </div>
        <div className="mt-[18px]">
          <PasswordField
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="new-password"
            readOnly={status !== "idle"}
            inputRef={passwordRef}
          />
        </div>

        <div className="mt-6">
          <SubmitButton
            status={status}
            idleLabel="Criar conta"
            loadingLabel="Criando…"
            doneLabel="Cadastro de demonstração"
          />
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {status === "loading" ? "Criando…" : status === "done" ? "Cadastro de demonstração concluído. Nenhuma conta real foi criada." : ""}
        </p>
      </form>
    </div>
  );
}
