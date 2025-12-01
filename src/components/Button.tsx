// TODO: unify Link.tsx

import type { ComponentChildren } from "preact";
import { getExternalLinkProps } from "../utils/linkUtils";
import { cn } from "../utils/cn";
import { commonStyles } from "../utils/commonStyles";

type ButtonProps = {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  ariaLabel?: string;
  id?: string;
  active?: boolean;
  children?: ComponentChildren;
};

export function Button({
  id,
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
  active = false,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    commonStyles.focusRing,
    active && "bg-accent text-bg shadow-sm",
    !active &&
      variant === "default" &&
      "bg-blue-600 text-white shadow hover:bg-blue-700",
    !active &&
      variant === "destructive" &&
      "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    !active &&
      variant === "outline" &&
      "border border-line bg-bg text-text-main shadow-sm hover:bg-surface hover:border-accent",
    !active &&
      variant === "secondary" &&
      "bg-surface text-text-main shadow-sm hover:bg-surface-hover",
    !active &&
      variant === "ghost" &&
      "text-text-main hover:bg-surface hover:text-text-main",
    !active &&
      variant === "link" &&
      "text-link underline-offset-4 hover:opacity-60",
    size === "default" && "h-9 px-4 py-2",
    size === "sm" && "h-8 rounded-md px-3 text-xs",
    size === "lg" && "h-10 rounded-md px-8",
    size === "icon" && "h-9 w-9",
    className,
  );

  const externalLinkProps = href ? getExternalLinkProps(href, target, rel) : {};

  if (href) {
    return (
      <a
        id={id}
        className={classes}
        href={href}
        {...externalLinkProps}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
}
