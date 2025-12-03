import type { ReactNode } from "react";
import { cn } from "../../../_utils/cn";
import { commonStyles } from "../../../_utils/commonStyles";

type Props = {
  className?: string;
  children: ReactNode;
};

export function CardHeader({ className, children }: Props) {
  return (
    <div className={cn(commonStyles.cardHeader, className)}>{children}</div>
  );
}
