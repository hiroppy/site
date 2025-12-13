import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Gap = "sm" | "md" | "lg";
type Ratio = "1:1" | "1:2" | "2:1" | "3:2" | "2:3";

type Props = {
  className?: string;
  gap?: Gap;
  ratio?: Ratio;
  children: ReactNode;
};

const gapClasses: Record<Gap, string> = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

const ratioClasses: Record<Ratio, string> = {
  "1:1": "md:grid-cols-2",
  "1:2":
    "md:grid-cols-3 [&>:first-child]:md:col-span-1 [&>:last-child]:md:col-span-2",
  "2:1":
    "md:grid-cols-3 [&>:first-child]:md:col-span-2 [&>:last-child]:md:col-span-1",
  "3:2":
    "md:grid-cols-5 [&>:first-child]:md:col-span-3 [&>:last-child]:md:col-span-2",
  "2:3":
    "md:grid-cols-5 [&>:first-child]:md:col-span-2 [&>:last-child]:md:col-span-3",
};

export function TwoColumn({
  className,
  gap = "md",
  ratio = "1:1",
  children,
}: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        ratioClasses[ratio],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}
