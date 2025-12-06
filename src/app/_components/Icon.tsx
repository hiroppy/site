import { Icon as IconifyIcon } from "@iconify/react";
import { cn } from "../_utils/cn";

type Props = {
  icon: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  inline?: boolean;
};

export function Icon({
  icon,
  className,
  width = "1em",
  height = "1em",
  inline = true,
}: Props) {
  return (
    <IconifyIcon
      icon={icon}
      className={cn("text-current", className)}
      width={width}
      height={height}
      inline={inline}
    />
  );
}
