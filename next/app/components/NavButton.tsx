"use client";

import Link from "next/link";
import { cn } from "@site/utils/cn";

type Variant = "default" | "active" | "mobile" | "mobile-active";

type Props = {
  variant?: Variant;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function NavButton({
  variant = "default",
  className,
  href,
  target,
  rel,
  ariaLabel,
  id,
  children,
  onClick,
}: Props) {
  const classes = cn(
    "relative rounded-md font-medium transition-all duration-200 active:bg-transparent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
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

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        id={id}
        href={href}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noreferrer" : undefined)}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button id={id} className={classes} aria-label={ariaLabel} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
