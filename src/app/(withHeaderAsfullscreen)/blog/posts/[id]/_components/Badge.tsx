import type { ReactNode } from "react";
import { cn } from "../../../../../_utils/cn";
import { commonStyles } from "../../../../../_utils/commonStyles";

type Props = {
  variant?: "default" | "secondary" | "destructive" | "outline" | "primary";
  className?: string;
  children: ReactNode;
};

export function Badge({ variant = "default", className, children }: Props) {
  const classes = cn(
    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
    commonStyles.focusRing,
    variant === "default" &&
      "bg-primary text-primary-foreground hover:bg-primary/80 shadow",
    variant === "primary" &&
      "bg-text-main text-white shadow-sm hover:opacity-80",
    variant === "secondary" &&
      "bg-surface text-text-main hover:bg-surface-hover",
    variant === "destructive" &&
      "bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow",
    variant === "outline" &&
      "border-line text-text-main hover:bg-surface border bg-white",
    className,
  );

  return <div className={classes}>{children}</div>;
}
