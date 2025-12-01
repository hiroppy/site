"use client";

import { Link } from "../../../../../../components/Link";
import { cn } from "../../../../../../utils/cn";
import { useCurrentCondition } from "../../_hooks/useCurrentCondition";
import { SidebarSection } from "./SidebarSection";

const navStyles = {
  item: "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  active: "bg-accent text-white shadow-sm",
  default: "text-gray-700 hover:bg-gray-200",
} as const;

export function TypeSection() {
  const { currentPeriod, currentType } = useCurrentCondition();

  return (
    <SidebarSection className="space-y-1">
      <Link
        href={`/labs/feedle/frontend${currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
        unstyled
        className={cn(
          "flex w-full items-center",
          navStyles.item,
          currentType === "frontend" ? navStyles.active : navStyles.default,
        )}
      >
        Frontend
      </Link>
      <Link
        href={`/labs/feedle/ai${currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
        unstyled
        className={cn(
          "flex w-full items-center",
          navStyles.item,
          currentType === "ai" ? navStyles.active : navStyles.default,
        )}
      >
        AI
      </Link>
    </SidebarSection>
  );
}
