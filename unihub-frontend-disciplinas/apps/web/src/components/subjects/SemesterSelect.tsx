import { ChevronDown } from "lucide-react";

interface SemesterSelectProps {
  value: string;
  options: string[];
  onChange: (semester: string) => void;
}

/** <select> nativo (acessível e confortável no celular) com o chevron sobreposto por grid, sem posicionamento absoluto. */
export function SemesterSelect({ value, options, onChange }: SemesterSelectProps) {
  return (
    <div className="grid shrink-0 items-center">
      <select
        aria-label="Semestre"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="col-start-1 row-start-1 min-h-11 w-[89px] appearance-none rounded-xl bg-surface pl-3.5 pr-8 text-[13px] font-medium text-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none col-start-1 row-start-1 mr-3 h-4 w-4 justify-self-end text-brand" aria-hidden />
    </div>
  );
}
