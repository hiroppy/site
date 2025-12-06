import type { ReactNode } from "react";
import { cn } from "../_utils/cn";
import { commonStyles } from "../_utils/commonStyles";
import { Link } from "./Link";

type LinkProps = {
  href: string;
  isBlank?: boolean;
  ariaLabel?: string;
};

type Props = {
  className?: string;
  variant?: "default" | "interactive";
  link?: LinkProps;
  ariaLabel?: string;
  id?: string;
  children: ReactNode;
};

export function Card({
  className,
  variant = "default",
  ariaLabel,
  link,
  id,
  children,
}: Props) {
  const baseClasses = cn(
    commonStyles.cardBase,
    "border-line",
    variant === "interactive" && commonStyles.cardInteractive,
    link && "group block cursor-pointer",
    className,
  );

  if (link) {
    return (
      <Link
        href={link.href}
        isBlank={link.isBlank}
        ariaLabel={link.ariaLabel}
        className={cn(
          baseClasses,
          "no-underline hover:no-underline focus-visible:shadow-2xl focus-visible:ring-8 focus-visible:shadow-blue-500/50 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:outline-none",
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <div id={id} className={baseClasses} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
