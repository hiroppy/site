// TODO: remove link
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { Link } from "./Link";

type ButtonProps = {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  id?: string;
  active?: boolean;
  children?: ReactNode;
  ariaLabel?: string;
};

export function Button({
  id,
  variant = "default",
  size = "default",
  className,
  href,
  disabled = false,
  type = "button",
  onClick,
  active = false,
  children,
  ariaLabel,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    "focus-ring",
    active && "bg-accent text-white shadow-sm",
    !active &&
      variant === "default" &&
      "bg-accent text-white shadow hover:bg-accent/90",
    !active &&
      variant === "destructive" &&
      "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    !active &&
      variant === "outline" &&
      "border-line bg-bg text-text-main hover:bg-surface hover:border-accent border shadow-sm",
    !active &&
      variant === "secondary" &&
      "bg-surface text-text-main hover:bg-surface-hover shadow-sm",
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

  if (href) {
    return (
      <Link
        id={id}
        href={href}
        unstyled
        className={classes}
        animation={false}
        ariaLabel={ariaLabel}
        {...rest}
      >
        {children}
      </Link>
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
