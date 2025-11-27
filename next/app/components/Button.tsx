"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@site/utils/cn";

type Variant = "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
type Size = "default" | "sm" | "lg" | "icon";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  ariaLabel?: string;
  id?: string;
  children: ReactNode;
};

export function Button({
  variant = "default",
  size = "default",
  className,
  href,
  target,
  rel,
  disabled = false,
  type = "button",
  onClick,
  ariaLabel,
  id,
  children,
}: Props) {
  const classes = cn(
    "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    variant === "default" &&
      "bg-blue-700 text-white shadow hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800",
    variant === "destructive" &&
      "bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    variant === "outline" &&
      "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    variant === "secondary" &&
      "bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
    variant === "ghost" &&
      "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
    variant === "link" && "text-blue-600 underline-offset-4 dark:text-blue-400",
    size === "default" && "h-9 px-4 py-2",
    size === "sm" && "h-8 rounded-md px-3 text-xs",
    size === "lg" && "h-10 rounded-md px-8",
    size === "icon" && "h-9 w-9",
    className,
  );

  const isLink = Boolean(href);
  const isExternal = href?.startsWith("http");

  if (isLink && isExternal) {
    return (
      <a
        id={id}
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noreferrer"}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (isLink && href) {
    return (
      <Link id={id} href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      id={id}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
