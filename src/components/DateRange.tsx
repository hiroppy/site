import { cn } from "../utils/cn";
import { formatDateJapanese } from "../utils/formatDate";

type Props = {
  start: string | Date;
  end?: string | Date | null;
  className?: string;
  isActive?: boolean;
  variant?: "badge" | "text";
};

export function DateRange({
  start,
  end,
  className,
  isActive = false,
  variant = "badge",
}: Props) {
  const formatValue = (value: string | Date) => {
    if (value instanceof Date) {
      return formatDateJapanese(value);
    }
    return value;
  };

  const startText = formatValue(start);
  const endText = end ? formatValue(end) : "Present";

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium",
        isActive ? "text-accent font-semibold" : "text-text-sub",
        variant === "badge" && "border-line rounded border px-3 py-1",
        className,
      )}
    >
      {startText} ~ {endText}
    </span>
  );
}
