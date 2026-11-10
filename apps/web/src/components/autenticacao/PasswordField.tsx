"use client";

import { useRef, useState, type Ref } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthField } from "./AuthField";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: "current-password" | "new-password";
  name?: string;
  readOnly?: boolean;
  onSheet?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Campo de senha REAL (type="password" de verdade, nunca bolinhas fixas), com alternância de visibilidade.
 * A senha não é alterada, não é guardada e aceita colar/gerenciadores de senha.
 */
export function PasswordField({
  label = "Senha",
  value,
  onChange,
  error,
  autoComplete,
  name = "password",
  readOnly,
  onSheet,
  inputRef,
}: PasswordFieldProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);

  function toggle() {
    const el = innerRef.current;
    const hadFocus = el !== null && document.activeElement === el;
    const start = el?.selectionStart ?? null;
    const end = el?.selectionEnd ?? null;
    setVisible((v) => !v);
    // Trocar o tipo pode reposicionar o cursor: restaura foco e seleção.
    if (el && hadFocus && start !== null && end !== null) {
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, end);
      });
    }
  }

  return (
    <AuthField
      label={label}
      icon={Lock}
      name={name}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      readOnly={readOnly}
      onSheet={onSheet}
      inputRef={(node) => {
        (innerRef as any).current = node;
        if (typeof inputRef === "function") {
          inputRef(node);
        } else if (inputRef) {
          (inputRef as any).current = node;
        }
      }}
      trailing={
        <button
          type="button"
          onClick={toggle}
          // Não rouba o foco do campo ao tocar (teclado continua aberto, sem saltos).
          onMouseDown={(e) => e.preventDefault()}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="-mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:text-ink"
        >
          {visible ? <Eye className="h-5 w-5" aria-hidden /> : <EyeOff className="h-5 w-5" aria-hidden />}
        </button>
      }
    />
  );
}
