"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  hideHeader?: boolean;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Diálogo que sobe de baixo. Controla o foco (prende o Tab, devolve ao fechar),
 * fecha com Esc e trava a rolagem do fundo. Fechado, desmonta os filhos.
 */
export function Sheet({ open, onClose, title, hideHeader = false, children }: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    // A rolagem da tela é do <main>, não do body: trava os dois.
    const scroller = panel?.closest("main") as HTMLElement | null;
    const previousOverflow = scroller?.style.overflowY ?? "";
    if (scroller) scroller.style.overflowY = "hidden";
    document.body.style.overflow = "hidden";
    panel?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (scroller) scroller.style.overflowY = previousOverflow;
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 animate-fade-in bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hideHeader ? undefined : titleId}
        aria-label={hideHeader ? title : undefined}
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full max-w-[480px] animate-sheet-in overflow-y-auto rounded-t-[28px] border-t border-line bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 outline-none"
      >
        <div className="mx-auto mb-3 h-1 w-12 shrink-0 rounded-full bg-line" />
        {!hideHeader && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 id={titleId} className="break-words text-xl font-semibold leading-snug">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
