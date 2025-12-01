import type { ComponentChildren } from "preact";
import { cn } from "../utils/cn";

type Props = {
  children: ComponentChildren;
  className?: string;
};

export function ListContainer({ children, className }: Props) {
  return <ul className={cn("m-0 list-none p-0", className)}>{children}</ul>;
}
