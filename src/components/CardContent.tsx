import type { ComponentChildren } from "preact";
import { cn } from "../utils/cn";
import { commonStyles } from "../utils/commonStyles";

type Props = {
  className?: string;
  children: ComponentChildren;
};

export function CardContent({ className, children }: Props) {
  return (
    <div className={cn(commonStyles.cardContent, className)}>{children}</div>
  );
}
