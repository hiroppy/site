import type { ReactNode } from "react";
import { Icon } from "../../../../_components/Icon";
import { Link } from "../../../../_components/Link";
import { cn } from "../../../../_utils/cn";
import { commonStyles } from "../../../../_utils/commonStyles";

type Props = {
  href: string;
  isActive?: boolean;
  icon?: string;
  className?: string;
  children: ReactNode;
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
    <Link
      href={href}
      unstyled
      className={cn(baseClasses, stateClasses, className)}
    >
      {icon && <Icon icon={icon} className="mr-2 h-4 w-4" />}
      {children}
    </Link>
  );
}
