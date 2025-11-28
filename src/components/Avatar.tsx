import type { ReactNode } from "react";
import { cn } from "../utils/cn";

type AvatarProps = {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  children?: ReactNode;
};

export function Avatar({ className = "", size = "md", children }: AvatarProps) {
  const classes = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    size === "xs" && "h-6 w-6",
    size === "sm" && "h-8 w-8",
    size === "md" && "h-10 w-10",
    size === "lg" && "h-12 w-12",
    size === "xl" && "h-32 w-32",
    className,
  );

  return <span className={classes}>{children}</span>;
}
