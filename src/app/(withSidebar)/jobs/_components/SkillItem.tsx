import { cn } from "../../../../utils/cn";

type Props = {
  title: string;
  from: number;
  to?: number;
  maintainer?: boolean;
  className?: string;
  currentYear?: number;
};

export function SkillItem({ title, from, to, className, currentYear }: Props) {
  const years = (to || currentYear || new Date().getFullYear()) - from;
  const isCurrent = !to;
  const experienceTier =
    years >= 8 ? "expert" : years >= 4 ? "intermediate" : "learning";

  return (
    <li
      className={cn(
        "border-line flex items-center justify-between rounded-md border px-4 py-3",
        experienceTier === "expert" && "bg-accent/5",
        experienceTier === "intermediate" && "bg-accent/3",
        // maintainer && "border-2 border-blue-300",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-text-main text-lg font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-text-sub text-sm font-medium">
          {from}
          {isCurrent ? "-" : `-${to}`}
        </span>
        <span className="text-accent text-xs font-semibold">{years}y</span>
      </div>
    </li>
  );
}
