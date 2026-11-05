"use client";

import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/context/SessionContext";
import { initialsFromEmail } from "@/lib/format";
import { Button } from "@/components/ui/Button";

/** Ponto de integração da aba "Ajustes". Por enquanto: conta e sair. */
export default function SettingsPage() {
  const { user, logout } = useCurrentUser();

  return (
    <div className="px-6 pb-8 pt-6">
      <h1 className="text-[30px] font-semibold leading-tight tracking-tight">Ajustes</h1>

      <section aria-label="Conta" className="mt-6 flex items-center gap-4 rounded-card border border-line bg-surface p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
          {initialsFromEmail(user.email)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
        </div>
      </section>

      <p className="mt-4 text-sm text-ink-soft">Mais ajustes chegam em breve.</p>

      <Button variant="secondary" className="mt-6 w-full" onClick={logout}>
        <LogOut className="h-4 w-4" aria-hidden />
        Sair da conta
      </Button>
    </div>
  );
}
