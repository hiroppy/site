import type { ComponentChildren } from "preact";
import { cn } from "../utils/cn";
import { isExternalLink } from "../utils/linkUtils";
import { commonStyles } from "../utils/commonStyles";
import { Icon } from "./Icon";

type Props = {
  href: string;
  isBlank?: boolean;
  className?: string;
  ariaLabel?: string;
  animation?: boolean;
  unstyled?: boolean;
  variant?: "default" | "button";
  id?: string;
  icon?: string;
  iconClassName?: string;
  children: ComponentChildren;
};

export function Link({
  href,
  isBlank,
  className,
  ariaLabel,
  animation = true,
  unstyled = false,
  variant = "default",
  id,
  icon,
  iconClassName,
  children,
}: Props) {
  const isExternal = isExternalLink(href);
  const internalHref = href.startsWith(import.meta.env.SITE)
    ? href.replace(import.meta.env.SITE, "/")
    : href;
  const shouldOpenInBlank = isExternal ? (isBlank ?? true) : false;
  const variantStyles = {
    default:
      !unstyled &&
      "text-link rounded underline decoration-from-font [text-underline-offset:2px] transition-opacity hover:opacity-70",
    button:
      "border-line text-text-main inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors hover:bg-gray-100",
  };

  return (
    <a
      id={id}
      href={internalHref}
      target={shouldOpenInBlank ? "_blank" : undefined}
      className={cn(
        variantStyles[variant],
        icon && variant === "default" && "inline-flex items-center gap-2",
        animation &&
          variant === "default" &&
          !unstyled &&
          commonStyles.focusRing,
        className,
      )}
      rel={shouldOpenInBlank ? "noreferrer" : undefined}
      aria-label={ariaLabel}
    >
      {icon && (
        <Icon
          icon={icon}
          width={16}
          height={16}
          className={cn("shrink-0 opacity-70", iconClassName)}
        />
      )}
      {children}
    </a>
  );
}
