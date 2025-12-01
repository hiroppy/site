import type { PropsWithChildren } from "react";
import { cn } from "../utils/cn";
import { Link } from "./Link";

type Props = PropsWithChildren<{
  href?: string;
  className?: string;
}>;

export function Tag({ href, className, children }: Props) {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 w-fit",
        href && "hover:bg-gray-200 transition-colors shadow",
        className,
      )}
    >
      {href ? (
        <Link href={href} unstyled ariaLabel={`${href}を表示`}>
          {children}
        </Link>
      ) : (
        children
      )}
    </div>
  );
}
