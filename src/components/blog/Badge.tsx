import type { ComponentChildren } from "preact";
import { cn } from "../../utils/cn";
import { commonStyles } from "../../utils/commonStyles";

type Props = {
  variant?: "default" | "secondary" | "destructive" | "outline" | "primary";
  className?: string;
  children: ComponentChildren;
};

export function Badge({ variant = "default", className, children }: Props) {
  const classes = cn(
    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
    commonStyles.focusRing,
    variant === "default" &&
      "bg-primary text-primary-foreground shadow hover:bg-primary/80",
    variant === "primary" &&
      "bg-text-main text-white hover:opacity-80 shadow-sm",
    variant === "secondary" &&
      "bg-surface text-text-main hover:bg-surface-hover",
    variant === "destructive" &&
      "bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    variant === "outline" &&
      "border border-line bg-white text-text-main hover:bg-surface",
    className,
  );

  return <div className={classes}>{children}</div>;
}
