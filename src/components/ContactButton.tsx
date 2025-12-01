import type { ComponentChildren } from "preact";
import { Link } from "./Link";
import { cn } from "../utils/cn";
import meta from "../../node_modules/hiroppy/generated/meta.json";

type Props = {
  variant?: "default" | "full";
  className?: string;
  icon?: string;
  children?: ComponentChildren;
};

export function ContactButton({
  variant = "default",
  className,
  icon = "mdi:email-outline",
  children = "お問い合わせ",
}: Props) {
  return (
    <Link
      href={meta.form.request}
      variant="button"
      className={cn(
        variant === "full" && "inline-flex w-full items-center justify-center",
        className,
      )}
      icon={icon}
    >
      {children}
    </Link>
  );
}
