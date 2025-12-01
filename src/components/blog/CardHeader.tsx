import type { ComponentChildren } from "preact";
import { cn } from "../../utils/cn";
import { commonStyles } from "../../utils/commonStyles";

type Props = {
  className?: string;
  children: ComponentChildren;
};

export function CardHeader({ className, children }: Props) {
  return (
    <div className={cn(commonStyles.cardHeader, className)}>{children}</div>
  );
}
