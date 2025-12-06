import type { ReactNode } from "react";
import { cn } from "../_utils/cn";
import { commonStyles } from "../_utils/commonStyles";
import { Link } from "./Link";

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
  children?: ReactNode;
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
    "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
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
        isBlank={target === "_blank"}
        ariaLabel={ariaLabel}
        animation={false}
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
