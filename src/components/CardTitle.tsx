import type { ComponentChildren } from "preact";
import { cn } from "../utils/cn";

type Props = {
  className?: string;
  children: ComponentChildren;
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
