import type { ReactNode } from "react";
import { getExternalLinkProps } from "../utils/linkUtils";
import { cn } from "../utils/cn";
import { commonStyles } from "../utils/commonStyles";

type NavButtonProps = {
  variant?: "default" | "active" | "mobile" | "mobile-active";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  id?: string;
  children?: ReactNode;
};

export function NavButton({
  variant = "default",
  className = "",
  href,
  target,
  rel,
  ariaLabel,
  id,
  children,
}: NavButtonProps) {
  const classes = cn(
    "relative rounded-md font-medium transition-all duration-200 active:bg-transparent",
    commonStyles.focusRing,
    variant === "default" &&
      "px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-transparent",
    variant === "active" &&
      "px-3 py-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    variant === "mobile" &&
      "block px-3 py-2 text-base text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-transparent",
    variant === "mobile-active" &&
      "block px-3 py-2 text-base bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    className,
  );

  const externalLinkProps = href ? getExternalLinkProps(href, target, rel) : {};

  const commonProps = {
    id,
    className: classes,
    ...(ariaLabel && { "aria-label": ariaLabel }),
  };

  if (href) {
    return (
      <a {...commonProps} href={href} {...externalLinkProps}>
        {children}
      </a>
    );
  }

  return <button {...commonProps}>{children}</button>;
}
