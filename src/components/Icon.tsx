import { Icon as IconifyIcon } from "@iconify/react";

type IconProps = {
  icon: string;
  className?: string;
  width?: string | number;
  height?: string | number;
};

export function Icon({
  icon,
  className,
  width = "1em",
  height = "1em",
}: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      className={className}
      width={width}
      height={height}
    />
  );
}
