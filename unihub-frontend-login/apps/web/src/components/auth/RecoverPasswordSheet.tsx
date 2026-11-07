"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useDemoSubmit } from "@/hooks/useDemoSubmit";
import { validateEmail } from "@/lib/auth-form";
import { Sheet } from "@/components/ui/Sheet";
import { AuthField } from "./AuthField";
import { SubmitButton } from "./SubmitButton";

// Mesmos 50 px e 14px/500 do botão principal, para os botões do painel ficarem iguais.
const actionBase =
  "flex min-h-[50px] items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors";
const secondaryAction = `${actionBase} bg-brand-soft text-brand hover:bg-brand-line`;
const primaryAction = `${actionBase} w-full bg-brand text-brand-on hover:bg-brand-deep`;

interface RecoverPasswordSheetProps {
  open: boolean;
  initialEmail: string;
  onClose: () => void;
}

/** Painel local de recuperação. É DEMONSTRAÇÃO: nenhum e-mail é enviado (e a tela diz isso). */
export function RecoverPasswordSheet({ open, initialEmail, onClose }: RecoverPasswordSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Recuperar senha">
      <RecoverBody initialEmail={initialEmail} onClose={onClose} />
    </Sheet>
  );
}

function RecoverBody({ initialEmail, onClose }: { initialEmail: string; onClose: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const { status, start } = useDemoSubmit({ loadingMs: 700 });

  const error = submitted ? validateEmail(email) : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setSubmitted(true);
    if (validateEmail(email)) {
      emailRef.current?.focus();
      return;
    }
    start();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Recuperar senha" className="space-y-4">
      <p className="text-sm text-ink-soft">Informe o e-mail da sua conta.</p>

      <AuthField
        label="E-mail"
        icon={Mail}
        name="recovery-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="lucas.silva@aluno.edu.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        readOnly={status !== "idle"}
        inputRef={emailRef}
        onSheet
      />

      {status === "done" && (
        <p role="status" className="rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed">
          <strong className="font-semibold text-brand">Demonstração:</strong> nenhum e-mail foi enviado. Em uma versão
          com servidor, as instruções de recuperação chegariam em{" "}
          <span className="break-all font-medium">{email.trim()}</span>.
        </p>
      )}

      {status === "done" ? (
        <button type="button" onClick={onClose} className={primaryAction}>
          Fechar
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="button" onClick={onClose} className={secondaryAction}>
            Voltar
          </button>
          <SubmitButton status={status} idleLabel="Continuar" loadingLabel="Enviando…" doneLabel="Continuar" />
        </div>
      )}
    </form>
  );
}
