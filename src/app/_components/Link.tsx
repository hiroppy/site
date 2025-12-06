import NextLink from "next/link";
import type { ReactNode } from "react";
import { cn } from "../_utils/cn";
import { commonStyles } from "../_utils/commonStyles";
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
  prefetch?: boolean;
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
  onClick,
  children,
  // TODO:
  prefetch = false,
}: Props) {
  const isExternal = isExternalLink(href);
  const shouldOpenInBlank = isExternal ? (isBlank ?? true) : false;
  const variantStyles = {
    default:
      !unstyled &&
      "text-link rounded underline decoration-from-font [text-underline-offset:2px] transition-opacity hover:opacity-70",
    button:
      "border-line text-text-main inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors hover:bg-gray-100",
  };

  return (
    <NextLink
      id={id}
      href={href}
      target={shouldOpenInBlank ? "_blank" : undefined}
      rel={shouldOpenInBlank ? "noreferrer" : undefined}
      className={cn(
        variantStyles[variant],
        icon && variant === "default" && "inline-flex items-center gap-2",
        animation &&
          variant === "default" &&
          !unstyled &&
          commonStyles.focusRing,
        className,
      )}
      aria-label={ariaLabel}
      onClick={onClick}
      prefetch={prefetch}
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
    </NextLink>
  );
}

function isExternalLink(href: string) {
  if (!href) return false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!siteUrl) {
    return href.startsWith("http");
  }

  return href.startsWith("http") && !href.startsWith(siteUrl);
}
