import { cn } from "../utils/cn";
import { ListContainer } from "./ListContainer";

type FilterTab<T = string> = {
  value: T;
  label: string;
  href?: string;
  onClick?: (value: T) => void;
};

type Props<T = string> = {
  tabs: FilterTab<T>[];
  activeValue: T;
  className?: string;
  onValueChange?: (value: T) => void;
};

export function FilterTabs<T = string>({
  tabs,
  activeValue,
  className,
  onValueChange,
}: Props<T>) {
  return (
    <div className={className}>
      <ListContainer className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.value === activeValue;
          const baseClasses = cn(
            "inline-block rounded px-4 py-1.5 text-base no-underline transition-opacity hover:opacity-60",
            isActive
              ? "bg-accent text-bg font-medium"
              : "text-text-sub border-line border bg-transparent",
          );

          // Use button for state-based tabs, anchor for URL-based tabs
          if (tab.href) {
            return (
              <li key={String(tab.value)}>
                <a href={tab.href} className={baseClasses}>
                  {tab.label}
                </a>
              </li>
            );
          }

          return (
            <li key={String(tab.value)}>
              <button
                type="button"
                className={cn(baseClasses, "cursor-pointer")}
                onClick={() => {
                  if (tab.onClick) {
                    tab.onClick(tab.value);
                  } else if (onValueChange) {
                    onValueChange(tab.value);
                  }
                }}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ListContainer>
    </div>
  );
}
