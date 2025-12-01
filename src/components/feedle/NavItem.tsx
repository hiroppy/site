import type { ComponentChildren } from "preact";
import { Icon } from "../Icon";
import { cn } from "../../utils/cn";
import { commonStyles } from "../../utils/commonStyles";

type Props = {
  href: string;
  isActive?: boolean;
  icon?: string;
  className?: string;
  children: ComponentChildren;
};

export function NavItem({
  href,
  isActive = false,
  icon,
  className,
  children,
}: Props) {
  const baseClasses = cn("flex w-full items-center", commonStyles.navItem);
  const stateClasses = isActive
    ? commonStyles.navActive
    : commonStyles.navDefault;

  return (
    <a href={href} class={cn(baseClasses, stateClasses, className)}>
      {icon && <Icon icon={icon} className="mr-2 h-4 w-4" />}
      {children}
    </a>
  );
}
