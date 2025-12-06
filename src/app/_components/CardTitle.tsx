import type { ReactNode } from "react";
import { cn } from "../_utils/cn";

type Props = {
  className?: string;
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function CardTitle({ className, children, level = 2 }: Props) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(
        "text-text-main group-hover:text-link font-semibold transition-colors",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
