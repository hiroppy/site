import type { ComponentChildren } from "preact";
import { Button } from "./Button";

type Props = {
  variant?: "default" | "active" | "mobile" | "mobile-active";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  id?: string;
  onClick?: () => void;
  children?: ComponentChildren;
};

export function NavButton({
  variant = "default",
  className,
  href,
  target,
  rel,
  ariaLabel,
  id,
  onClick,
  children,
}: Props) {
  const isActive = variant === "active" || variant === "mobile-active";
  const isMobile = variant === "mobile" || variant === "mobile-active";

  return (
    <Button
      id={id}
      href={href}
      target={target}
      rel={rel}
      ariaLabel={ariaLabel}
      active={isActive}
      variant="ghost"
      size={isMobile ? "default" : "sm"}
      className={className}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
