"use client";

import { Icon } from "../../../../_components/Icon";
import { Link } from "../../../../_components/Link";
import { cn } from "../../../../_utils/cn";
import type { ServiceGroup } from "../_utils/feedle/articlesApi";
import { ServiceIcon } from "./ServiceIcon";

type ServiceListItemVariant = "sidebar" | "dialog";

type Props = {
  serviceName: string;
  serviceData: ServiceGroup;
  href: string;
  isSelected?: boolean;
  showCount?: boolean;
  showVisibilityToggle?: boolean;
  showLastUpdated?: boolean;
  variant?: ServiceListItemVariant;
  subscribed?: boolean;
  onToggle?: () => void;
};

export function ServiceListItem({
  serviceName,
  serviceData,
  href,
  isSelected = false,
  showCount = true,
  showVisibilityToggle = false,
  showLastUpdated = false,
  variant = "sidebar",
  subscribed = true,
  onToggle,
}: Props) {
  const firstSource = serviceData.sources[0];

  const variantClasses: Record<ServiceListItemVariant, string> = {
    sidebar: isSelected
      ? "flex items-center gap-3 rounded-lg bg-blue-600 text-white shadow-sm px-3 py-2 text-sm font-medium transition-colors"
      : "flex items-center gap-3 rounded-lg text-gray-700 hover:bg-gray-200 px-3 py-2 text-sm font-medium transition-colors",
    dialog:
      "flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50",
  };

  if (variant === "dialog" && showVisibilityToggle) {
    return (
      <div
        className={cn(
          "source-card",
          variantClasses[variant],
          !subscribed && "opacity-60",
        )}
        data-source-id={firstSource.id}
      >
        <Link
          href={href}
          unstyled
          className="flex min-w-0 flex-1 items-start gap-3"
        >
          <div className="mt-0.5 shrink-0">
            <ServiceIcon source={firstSource} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-semibold text-gray-900">
              {serviceName}
            </h3>
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                {showCount && (
                  <>
                    <span className="font-medium">
                      {serviceData.articleCount} articles
                    </span>
                    <span>•</span>
                  </>
                )}
                <span className="capitalize">{firstSource.kind}</span>
              </div>
              {showLastUpdated && firstSource.latest && (
                <div className="text-gray-400">
                  Last:{" "}
                  {new Date(firstSource.latest).toLocaleString("ja-JP", {
                    timeZone: "Asia/Tokyo",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="shrink-0">
          <button
            type="button"
            className="subscription-toggle cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            data-source-id={firstSource.id}
            title="Toggle subscription"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggle?.();
            }}
          >
            <Icon
              icon="mdi:heart"
              className={cn(
                "subscribed-icon h-4 w-4 text-red-400",
                !subscribed && "hidden",
              )}
            />
            <Icon
              icon="mdi:heart-outline"
              className={cn(
                "unsubscribed-icon h-4 w-4",
                subscribed && "hidden",
              )}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      unstyled
      className={variantClasses[variant]}
      data-source-id={firstSource.id}
    >
      <ServiceIcon source={firstSource} size="sm" />
      <span className="flex-1 truncate">{serviceName}</span>
      {showCount && (
        <span
          className={cn(
            "ml-2 rounded-full px-2 py-0.5 text-xs",
            isSelected ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-600",
          )}
        >
          {serviceData.articleCount || 0}
        </span>
      )}
    </Link>
  );
}
