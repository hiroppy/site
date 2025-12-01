import { cn } from "../utils/cn";
import { Link } from "./Link";
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
  secondary?: boolean;
  onValueChange?: (value: T) => void;
};

export function FilterTabs<T = string>({
  tabs,
  activeValue,
  className,
  secondary,
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
            secondary && isActive && "bg-accent/70",
          );

          return (
            <li key={`${tab.value}`}>
              {tab.href ? (
                <Link href={tab.href} unstyled className={baseClasses}>
                  {tab.label}
                </Link>
              ) : (
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
              )}
            </li>
          );
        })}
      </ListContainer>
    </div>
  );
}
