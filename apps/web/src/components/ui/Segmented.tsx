import { cn } from "@/lib/cn";

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-ink/10 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-10 rounded-[10px] px-3 text-sm font-semibold transition-colors",
            o.value === value ? "bg-brand-soft text-brand" : "text-ink-soft",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
