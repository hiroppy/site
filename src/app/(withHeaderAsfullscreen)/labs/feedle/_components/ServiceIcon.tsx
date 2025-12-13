import { MdLanguage } from "react-icons/md";
import { cn } from "../../../../../utils/cn";
import type { Source } from "../_utils/articlesApi";

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
  const iconClass = cn(sizeClasses[size], className);

  // Use favicon if available, otherwise use default icon
  if (source.favicon) {
    return (
      <img
        src={source.favicon}
        alt={source.name}
        className={cn(iconClass, "rounded object-contain")}
        onError={(e) => {
          // Fallback to default if image fails to load
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  // Default fallback icon (web icon from react-icons)
  return (
    <div
      className={cn(
        iconClass,
        "flex items-center justify-center rounded bg-gray-200 text-gray-500",
      )}
      title={source.name}
    >
      <MdLanguage className="h-3 w-3" />
    </div>
  );
}
