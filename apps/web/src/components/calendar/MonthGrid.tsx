import { buildMonthGrid, formatFullDate, isSameDay, toISODate } from "@/lib/calendar";
import { WEEKDAYS } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface MonthGridProps {
  year: number;
  month: number;
  selected: Date;
  today: Date;
  /** Datas ISO que têm lembretes. */
  markedDates: Set<string>;
  onSelect: (date: Date) => void;
}

const SUNDAY_FIRST = [0, 1, 2, 3, 4, 5, 6].map((i) => WEEKDAYS.find((w) => w.value === i)!.short);

export function MonthGrid({ year, month, selected, today, markedDates, onSelect }: MonthGridProps) {
  const cells = buildMonthGrid(year, month);

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-ink-soft" aria-hidden>
        {SUNDAY_FIRST.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />;
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          const marked = markedDates.has(toISODate(date));
          return (
            <button
              key={date.getDate()}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={`${formatFullDate(date)}${marked ? ", com lembrete" : ""}`}
              className={cn(
                "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isSelected
                  ? "bg-brand text-brand-on"
                  : isToday
                    ? "bg-brand-soft font-bold text-brand"
                    : "text-ink hover:bg-ink/5",
              )}
            >
              {date.getDate()}
              {marked && (
                <span
                  aria-hidden
                  className={cn("absolute bottom-1 h-1 w-1 rounded-full", isSelected ? "bg-brand-on" : "bg-brand")}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
