"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, CalendarDays, House, Layers } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/home", label: "Hoje", Icon: House, match: ["/home"] },
  { href: "/disciplinas", label: "Disciplinas", Icon: Layers, match: ["/disciplinas"] },
  { href: "/simulador", label: "Simular faltas", Icon: Calculator, match: ["/simulador"] },
  { href: "/calendario", label: "Calendário", Icon: CalendarDays, match: ["/calendario"] },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="shrink-0 bg-surface pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center gap-1 text-[10px] transition-colors",
                  active ? "font-semibold text-brand" : "font-medium text-ink-soft hover:text-ink",
                )}
              >
                {/* Indicador do destino ativo: 28 × 2 px no topo */}
                <span aria-hidden className={cn("h-0.5 w-7 rounded-full", active ? "bg-brand" : "bg-transparent")} />
                <Icon className="mt-2 h-6 w-6" strokeWidth={1.75} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
