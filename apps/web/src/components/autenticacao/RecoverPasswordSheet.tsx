"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { api } from "@/lib/api";
import { validateEmail, validatePassword } from "@/lib/auth-form";
import { Sheet } from "@/components/ui/Sheet";
import { AuthField } from "./AuthField";
import { PasswordField } from "./PasswordField";
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

/** Painel de redefinição direta de senha conectado à API. */
export function RecoverPasswordSheet({ open, initialEmail, onClose }: RecoverPasswordSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Redefinir senha">
      <RecoverBody initialEmail={initialEmail} onClose={onClose} />
    </Sheet>
  );
}

function RecoverBody({ initialEmail, onClose }: { initialEmail: string; onClose: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const emailError = submitted ? validateEmail(email) : undefined;
  const passwordError = submitted ? validatePassword(newPassword) : undefined;
  const confirmError =
    submitted && !passwordError && newPassword !== confirmPassword
      ? "As senhas não coincidem."
      : undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setSubmitted(true);
    setApiError(null);

    if (validateEmail(email)) {
      emailRef.current?.focus();
      return;
    }
    if (validatePassword(newPassword) || newPassword !== confirmPassword) {
      passwordRef.current?.focus();
      return;
    }

    setStatus("loading");
    const res = await api.auth.forgotPassword(email.trim(), newPassword);

    if (res.error) {
      setStatus("idle");
      setApiError(res.error);
      return;
    }

    setStatus("done");
    setServerMessage(res.data?.message || "Senha redefinida com sucesso!");
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Redefinir senha" className="space-y-4">
      <p className="text-sm text-ink-soft">
        Informe seu e-mail e escolha sua nova senha de acesso.
      </p>

      {apiError && (
        <div className="rounded-xl border border-crit/40 bg-crit-soft p-3 text-xs text-crit">
          {apiError}
        </div>
      )}

      <AuthField
        label="E-mail da conta"
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
        error={emailError}
        readOnly={status !== "idle"}
        inputRef={emailRef}
        onSheet
      />

      <PasswordField
        label="Nova senha"
        value={newPassword}
        onChange={setNewPassword}
        error={passwordError}
        autoComplete="new-password"
        readOnly={status !== "idle"}
        inputRef={passwordRef}
        onSheet
      />

      <PasswordField
        label="Confirmar nova senha"
        name="confirm-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={confirmError}
        autoComplete="new-password"
        readOnly={status !== "idle"}
        onSheet
      />

      {status === "done" && (
        <p role="status" className="rounded-xl border border-safe/40 bg-safe-soft p-4 text-sm leading-relaxed text-ink">
          {serverMessage}
        </p>
      )}

      {status === "done" ? (
        <button type="button" onClick={onClose} className={primaryAction}>
          Concluir e entrar
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="button" onClick={onClose} className={secondaryAction}>
            Cancelar
          </button>
          <SubmitButton
            status={status}
            idleLabel="Salvar senha"
            loadingLabel="Salvando…"
            doneLabel="Salva!"
          />
        </div>
      )}
    </form>
  );
}
