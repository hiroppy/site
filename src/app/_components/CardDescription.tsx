import type { ReactNode } from "react";
import { cn } from "../_utils/cn";

type Props = {
  className?: string;
  children: ReactNode;
};

export function CardDescription({ className, children }: Props) {
  return <p className={cn("text-text-sub text-sm", className)}>{children}</p>;
}
