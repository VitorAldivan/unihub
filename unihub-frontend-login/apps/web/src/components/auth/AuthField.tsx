"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type RefObject } from "react";
import { CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: string;
  icon: LucideIcon;
  error?: string;
  /** Elemento à direita dentro do campo (ex.: botão de visibilidade da senha). */
  trailing?: ReactNode;
  /** true quando o campo está dentro de um painel (fundo "surface"): usa o fundo escuro da página. */
  onSheet?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

/**
 * Campo de acesso: rótulo EXTERNO sempre visível, ícone à esquerda, 54 px de altura mínima.
 * Texto de 16 px (evita zoom automático em navegadores móveis). O erro vem em texto, ligado ao campo.
 */
export function AuthField({ label, icon: Icon, error, trailing, onSheet = false, inputRef, ...input }: AuthFieldProps) {
  const id = useId();
  const errorId = `${id}-erro`;

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          "mt-2 flex min-h-[54px] items-center gap-3 rounded-xl border px-3.5 transition-colors focus-within:ring-2 focus-within:ring-brand/30",
          onSheet ? "bg-paper" : "bg-surface",
          error ? "border-crit" : "border-line-field focus-within:border-brand",
        )}
      >
        <Icon className="h-[19px] w-[19px] shrink-0 text-ink-soft" aria-hidden />
        <input
          id={id}
          ref={inputRef}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          // Teclado virtual: traz o campo focado para o meio da área visível.
          onFocus={(e) => e.currentTarget.scrollIntoView?.({ block: "center" })}
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink-faint"
          {...input}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-crit-ink">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
