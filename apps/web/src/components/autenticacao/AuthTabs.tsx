"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export type AuthTab = "login" | "signup";

export const AUTH_TABS: { id: AuthTab; label: string }[] = [
  { id: "login", label: "Entrar" },
  { id: "signup", label: "Criar conta" },
];

export const tabId = (tab: AuthTab) => `auth-tab-${tab}`;
export const panelId = (tab: AuthTab) => `auth-panel-${tab}`;

/** Aba que a tecla escolhe (padrão WAI-ARIA para abas). null = tecla ignorada. */
export function nextTab(current: AuthTab, key: string): AuthTab | null {
  const last = AUTH_TABS.length - 1;
  const i = AUTH_TABS.findIndex((t) => t.id === current);
  switch (key) {
    case "ArrowRight":
      return AUTH_TABS[i === last ? 0 : i + 1].id;
    case "ArrowLeft":
      return AUTH_TABS[i === 0 ? last : i - 1].id;
    case "Home":
      return AUTH_TABS[0].id;
    case "End":
      return AUTH_TABS[last].id;
    default:
      return null;
  }
}

/**
 * Abas "Entrar" / "Criar conta": texto com linha inferior (não é controle segmentado).
 * Primeira área de 116 px (cresce se o texto for ampliado), intervalo de 28 px, segunda ocupa o restante;
 * 44 px de altura. Com zoom extremo as abas quebram de linha em vez de cortar o rótulo.
 */
export function AuthTabs({ value, onChange }: { value: AuthTab; onChange: (tab: AuthTab) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const next = nextTab(value, e.key);
    if (!next) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Acesso ao UniHub" onKeyDown={handleKeyDown} className="mt-3 flex flex-wrap gap-x-[28px]">
      {AUTH_TABS.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={tabId(tab.id)}
            aria-selected={selected}
            aria-controls={panelId(tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex min-h-11 flex-col text-left text-sm transition-colors",
              index === 0 ? "min-w-[116px] shrink-0" : "min-w-[6.5rem] flex-1",
              selected ? "font-semibold text-brand" : "font-normal text-ink-soft hover:text-ink",
            )}
          >
            <span className="flex flex-1 items-center">{tab.label}</span>
            <span aria-hidden className="flex h-0.5 w-full items-end">
              <span className={cn("w-full", selected ? "h-0.5 bg-brand" : "h-px bg-line")} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
