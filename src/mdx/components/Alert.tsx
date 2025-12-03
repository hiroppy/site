import type { ReactNode } from "react";
import { Icon } from "../../app/_components/Icon";
import { cn } from "../../app/_utils/cn";

type AlertType = "note" | "tip" | "important" | "warning" | "caution";

type Props = {
  type: AlertType;
  children: ReactNode;
};

const alertConfig: Record<
  AlertType,
  { icon: string; title: string; colorClass: string; iconClass: string }
> = {
  note: {
    icon: "mdi:information",
    title: "Note",
    colorClass: "border-blue-200 bg-blue-50/50 text-blue-900",
    iconClass: "text-blue-700",
  },
  tip: {
    icon: "mdi:lightbulb",
    title: "Tip",
    colorClass: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
    iconClass: "text-emerald-700",
  },
  important: {
    icon: "mdi:alert-circle",
    title: "Important",
    colorClass: "border-purple-200 bg-purple-50/50 text-purple-900",
    iconClass: "text-purple-700",
  },
  warning: {
    icon: "mdi:alert",
    title: "Warning",
    colorClass: "border-amber-200 bg-amber-50/50 text-amber-900",
    iconClass: "text-amber-700",
  },
  caution: {
    icon: "mdi:alert-octagon",
    title: "Caution",
    colorClass: "border-rose-200 bg-rose-50/50 text-rose-900",
    iconClass: "text-rose-700",
  },
};

export function Alert({ type, children }: Props) {
  const config = alertConfig[type];

  return (
    <div
      className={cn(
        "alert my-6 rounded-lg border p-4",
        `alert-${type}`,
        config.colorClass,
      )}
      role="note"
    >
      <div className="alert-header mb-2 flex items-center gap-2 font-semibold">
        <Icon
          icon={config.icon}
          className={cn("alert-icon shrink-0", config.iconClass)}
          width={20}
          height={20}
        />
        <span className="alert-title text-sm font-bold tracking-wider uppercase">
          {config.title}
        </span>
      </div>
      <div className="alert-content text-sm leading-relaxed">{children}</div>
    </div>
  );
}
