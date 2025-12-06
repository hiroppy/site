import type { ReactNode } from "react";
import { cn } from "../_utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ListContainer({ children, className }: Props) {
  return <ul className={cn("m-0 list-none p-0", className)}>{children}</ul>;
}
