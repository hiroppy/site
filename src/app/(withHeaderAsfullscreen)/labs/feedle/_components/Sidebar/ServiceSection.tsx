"use client";

import { Link } from "../../../../../../components/Link";
import { cn } from "../../../../../../utils/cn";
import { useCurrentCondition } from "../../_hooks/useCurrentCondition";
import type { ServiceGroup } from "../../_utils/articlesApi";
import { ServiceListItem } from "./../ServiceListItem";
import { ServicesHeader } from "./ServicesHeader";

const navStyles = {
  item: "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
  active: "bg-accent text-white shadow-sm",
  default: "text-gray-700 hover:bg-gray-200",
} as const;

type Props = {
  serviceGroups: Record<string, ServiceGroup>;
};

export function ServiceSection({ serviceGroups }: Props) {
  const { currentType, currentCategory, currentService, currentPeriod } =
    useCurrentCondition();

  const filteredServiceGroups =
    currentCategory === "all"
      ? serviceGroups
      : Object.fromEntries(
          Object.entries(serviceGroups).filter(([_, group]) => {
            // Check if any source in this group matches the current category
            return group.sources.some(
              (source) => source.kind === currentCategory,
            );
          }),
        );
  const sortedServices = Object.entries(filteredServiceGroups).sort(
    ([a], [b]) => {
      const aSelected =
        filteredServiceGroups[a].sources[0].id === currentService;
      const bSelected =
        filteredServiceGroups[b].sources[0].id === currentService;
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.localeCompare(b);
    },
  );

  const visibleSourceCount = sortedServices.length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ServicesHeader
        serviceGroups={filteredServiceGroups}
        visibleSourceCount={visibleSourceCount}
      />

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <Link
            href={`/labs/feedle/${currentType}/${currentCategory}${currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
            unstyled
            className={cn(
              "flex w-full items-center",
              navStyles.item,
              !currentService ? navStyles.active : navStyles.default,
            )}
          >
            All
          </Link>

          {sortedServices.map(([serviceName, serviceData]) => {
            const isSelected = serviceData.sources[0].id === currentService;
            return (
              <ServiceListItem
                key={serviceName}
                serviceName={serviceName}
                serviceData={serviceData}
                href={`/labs/feedle/${currentType}/${currentCategory === "all" ? serviceData.sources[0].kind : currentCategory}/${serviceData.sources[0].id}${currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                isSelected={isSelected}
                variant="sidebar"
                showCount={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
