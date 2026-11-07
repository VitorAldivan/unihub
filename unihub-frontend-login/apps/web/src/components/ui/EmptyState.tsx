import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">{text}</p>
      {children && <div className="mt-5 flex flex-col items-center gap-2">{children}</div>}
    </div>
  );
}
