import meta from "hiroppy/generated/meta.json";
import type { ReactNode } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { cn } from "../utils/cn";
import { Link } from "./Link";

type Props = {
  variant?: "default" | "full";
  className?: string;
  children?: ReactNode;
};

export function ContactButton({ variant = "default", className }: Props) {
  return (
    <Link
      href={meta.form.request}
      variant="button"
      className={cn(
        "text-accent border-accent font-semibold",
        variant === "full" && "inline-flex w-full items-center justify-center",
        className,
      )}
      icon={<MdOutlineEmail size={16} aria-hidden="true" focusable="false" />}
    >
      お問い合わせ
    </Link>
  );
}
