import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Props = {
  summary?: string;
  children: ReactNode;
};

export function Details({ summary = "Details", children }: Props) {
  return (
    <details
      className={cn(
        "details my-6 rounded-lg border border-gray-200 bg-gray-100/50 overflow-hidden",
      )}
    >
      <summary className="details-summary cursor-pointer px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100/50 select-none">
        {summary}
      </summary>
      <div className="details-content px-4 pb-4 pt-2 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </details>
  );
}
