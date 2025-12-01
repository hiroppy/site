import type { ReactNode } from "react";
import {
  MdError,
  MdInfo,
  MdLightbulb,
  MdReportProblem,
  MdWarning,
} from "react-icons/md";
import { cn } from "../../utils/cn";

type AlertType = "note" | "tip" | "important" | "warning" | "caution";

type Props = {
  type: AlertType;
  children: ReactNode;
};

const alertConfig: Record<
  AlertType,
  {
    icon: typeof MdInfo;
    title: string;
    colorClass: string;
    iconClass: string;
  }
> = {
  note: {
    icon: MdInfo,
    title: "Note",
    colorClass: "border-blue-200 bg-blue-50/50 text-blue-900",
    iconClass: "text-blue-700",
  },
  tip: {
    icon: MdLightbulb,
    title: "Tip",
    colorClass: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
    iconClass: "text-emerald-700",
  },
  important: {
    icon: MdError,
    title: "Important",
    colorClass: "border-purple-200 bg-purple-50/50 text-purple-900",
    iconClass: "text-purple-700",
  },
  warning: {
    icon: MdWarning,
    title: "Warning",
    colorClass: "border-amber-200 bg-amber-50/50 text-amber-900",
    iconClass: "text-amber-700",
  },
  caution: {
    icon: MdReportProblem,
    title: "Caution",
    colorClass: "border-rose-200 bg-rose-50/50 text-rose-900",
    iconClass: "text-rose-700",
  },
};

export function Alert({ type, children }: Props) {
  const config = alertConfig[type];
  const IconComponent = config.icon;

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
        <IconComponent
          className={cn("alert-icon shrink-0", config.iconClass)}
          size={20}
          aria-hidden="true"
          focusable="false"
        />
        <span className="alert-title text-sm font-bold tracking-wider uppercase">
          {config.title}
        </span>
      </div>
      <div className="alert-content text-sm leading-relaxed">{children}</div>
    </div>
  );
}
