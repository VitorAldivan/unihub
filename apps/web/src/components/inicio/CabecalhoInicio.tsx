import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface HomeHeaderProps {
  name: string;
  initials: string;
  dateLabel: string;
  greeting: string;
}

export function CabecalhoInicio({ name, initials, dateLabel, greeting }: HomeHeaderProps) {
  return (
    <header>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-[22px] w-[22px] text-brand" strokeWidth={1.5} aria-hidden />
          <span className="text-[17px] font-semibold">UniHub</span>
        </div>
        <Link
          href="/ajustes"
          aria-label={`Ajustes da conta de ${name}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand"
        >
          {initials}
        </Link>
      </div>
      <p className="mt-8 text-xs text-ink-soft">{dateLabel}</p>
      <h1 className="mt-2 break-words text-[30px] font-semibold leading-tight tracking-tight">
        {greeting}, {name}!
      </h1>
    </header>
  );
}

export { CabecalhoInicio as HomeHeader };
