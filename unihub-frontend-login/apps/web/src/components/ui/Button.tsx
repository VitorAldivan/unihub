import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-on hover:bg-brand-deep",
  secondary: "bg-brand-soft text-brand hover:bg-brand-line",
  ghost: "text-ink-soft hover:bg-ink/5",
  danger: "text-crit-ink hover:bg-crit-soft",
};

/** Também serve para estilizar <Link> como botão. */
export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}
