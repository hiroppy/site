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

export function CategorySection() {
  const { currentType, currentPeriod, currentCategory } = useCurrentCondition();

  return (
    <SidebarSection title="Categories" padding="compact" className="space-y-1">
      {[
        { category: "all", label: "All", path: "" },
        { category: "official", label: "Official", path: "/official" },
        { category: "community", label: "Community", path: "/community" },
        { category: "release", label: "Release", path: "/release" },
        { category: "podcast", label: "Podcast", path: "/podcast" },
      ].map(({ category, label, path }) => (
        <Link
          key={category}
          href={`/labs/feedle/${currentType}${path}${currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
          unstyled
          className={cn(
            "flex w-full items-center",
            navStyles.item,
            currentCategory === category ? navStyles.active : navStyles.default,
          )}
        >
          {label}
        </Link>
      ))}
    </SidebarSection>
  );
}
