"use client";

import { FilterTabs } from "../../../../../../components/FilterTabs";
import { useCurrentCondition } from "../../_hooks/useCurrentCondition";
import { SidebarSection } from "./SidebarSection";

export function DateFilterSection() {
  const { currentType, currentCategory, currentService, currentPeriod } =
    useCurrentCondition();

  const buildUrl = (period: string) => {
    let url = `/labs/feedle/${currentType}`;

    if (currentCategory !== "all") {
      url += `/${currentCategory}`;

      if (currentService) {
        url += `/${currentService}`;
      }
    }

    if (period !== "all") {
      url += `?period=${period}`;
    }

    return url;
  };

  return (
    <SidebarSection title="Period" padding="compact">
      <FilterTabs
        tabs={[
          { value: "all", label: "All", href: buildUrl("all") },
          { value: "month", label: "Month", href: buildUrl("month") },
          { value: "today", label: "Today", href: buildUrl("today") },
        ]}
        activeValue={currentPeriod || "all"}
        className="flex space-x-1"
      />
    </SidebarSection>
  );
}
