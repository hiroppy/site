import type { ComponentChildren } from "preact";
import { cn } from "../utils/cn";

type Props = {
  className?: string;
  children: ComponentChildren;
};

export function CardDescription({ className, children }: Props) {
  return <p className={cn("text-text-sub text-sm", className)}>{children}</p>;
}
