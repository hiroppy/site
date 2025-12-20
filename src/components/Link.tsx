import NextLink from "next/link";
import type { ReactNode } from "react";
import { SITE_URL } from "../constants";
import { cn } from "../utils/cn";

export type Props = {
  href: string;
  isBlank?: boolean;
  className?: string;
  ariaLabel?: string;
  animation?: boolean;
  unstyled?: boolean;
  variant?: "default" | "button";
  id?: string;
  icon?: ReactNode;
  prefetch?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
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
  prefetch = true,
  onClick,
  children,
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
        animation && variant === "default" && !unstyled && "focus-ring",
        className,
      )}
      prefetch={prefetch}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {icon}
      {children}
    </NextLink>
  );
}

function isExternalLink(href: string) {
  if (!href) return false;

  if (!SITE_URL) {
    return href.startsWith("http");
  }

  return href.startsWith("http") && !href.startsWith(SITE_URL);
}
