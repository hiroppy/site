import meta from "hiroppy/generated/meta.json";
import type { ReactNode } from "react";
import { cn } from "../_utils/cn";
import { Link } from "./Link";

type Props = {
  variant?: "default" | "full";
  className?: string;
  children?: ReactNode;
};

// TODO: 背景色検討
export function ContactButton({ variant = "default", className }: Props) {
  return (
    <Link
      href={meta.form.request}
      variant="button"
      className={cn(
        variant === "full" && "inline-flex w-full items-center justify-center",
        className,
      )}
      icon="mdi:email-outline"
    >
      お問い合わせ
    </Link>
  );
}
