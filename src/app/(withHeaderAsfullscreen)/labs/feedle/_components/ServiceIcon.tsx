import { Icon } from "../../../../_components/Icon";
import { cn } from "../../../../_utils/cn";
import type { Source } from "../_utils/feedle/articlesApi";
import { getServiceIcon } from "../_utils/feedle/serviceIcon";

type Props = {
  source: Source;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export function ServiceIcon({ source, size = "md", className }: Props) {
  const serviceIcon = getServiceIcon(source);
  const iconClass = cn(sizeClasses[size], className);

  if (serviceIcon.type === "url") {
    return (
      <img
        src={serviceIcon.value}
        alt={source.name}
        className={cn(iconClass, "rounded")}
      />
    );
  }

  return (
    <Icon icon={serviceIcon.value} className={cn(iconClass, "text-gray-500")} />
  );
}
