import type { ReactNode } from "react";
import { cn } from "../../../../../../utils/cn";

type Props = {
  title?: string;
  noBorder?: boolean;
  padding?: "normal" | "compact";
  className?: string;
  children: ReactNode;
};

export function SidebarSection({
  title,
  noBorder = false,
  padding = "normal",
  className,
  children,
}: Props) {
  const paddingClass = padding === "compact" ? "p-3" : "p-4";
  const borderClass = noBorder ? "" : "border-b border-gray-200";

  return (
    <div className={cn("shrink-0", borderClass, className)}>
      <div className={paddingClass}>
        {title && (
          <h3 className="mb-2 text-sm font-medium text-gray-700">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
}
