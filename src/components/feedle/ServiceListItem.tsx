import { Icon } from "../Icon";
import { ServiceIcon } from "./ServiceIcon";
import type { ServiceGroup } from "../../utils/feedle/articlesApi";
import { cn } from "../../utils/cn";

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
        class={cn(
          "source-card",
          variantClasses[variant],
          !subscribed && "opacity-60",
        )}
        data-source-id={firstSource.id}
      >
        <a href={href} class="flex min-w-0 flex-1 items-start gap-3">
          <div class="mt-0.5 shrink-0">
            <ServiceIcon source={firstSource} size="lg" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="mb-1 truncate font-semibold text-gray-900">
              {serviceName}
            </h3>
            <div class="flex flex-col gap-1 text-xs text-gray-500">
              <div class="flex items-center gap-2">
                {showCount && (
                  <>
                    <span class="font-medium">
                      {serviceData.articleCount} articles
                    </span>
                    <span>•</span>
                  </>
                )}
                <span class="capitalize">{firstSource.kind}</span>
              </div>
              {showLastUpdated && firstSource.latest && (
                <div class="text-gray-400">
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
        </a>
        <div class="shrink-0">
          <button
            type="button"
            class="subscription-toggle cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
    <a
      href={href}
      class={variantClasses[variant]}
      data-source-id={firstSource.id}
    >
      <ServiceIcon source={firstSource} size="sm" />
      <span class="flex-1 truncate">{serviceName}</span>
      {showCount && (
        <span
          class={cn(
            "ml-2 rounded-full px-2 py-0.5 text-xs",
            isSelected ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-600",
          )}
        >
          {serviceData.articleCount || 0}
        </span>
      )}
    </a>
  );
}
