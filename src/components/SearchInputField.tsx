import type { ChangeEvent, CompositionEvent } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { cn } from "../utils/cn";

type Props = {
  id: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: (event: CompositionEvent<HTMLInputElement>) => void;
  isSearching?: boolean;
  disabled?: boolean;
};

export function SearchInputField({
  id,
  placeholder = "Search...",
  className,
  value,
  onChange,
  onClear,
  onFocus,
  onCompositionStart,
  onCompositionEnd,
  isSearching = false,
  disabled = false,
}: Props) {
  const showClear = value.trim().length > 0 && !disabled;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const syntheticEvent = {
        currentTarget: { value: "" },
        target: { value: "" },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="text-icon-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform">
        <MdSearch size={16} aria-hidden="true" focusable="false" />
      </div>
      <input
        id={id}
        type="text"
        role="searchbox"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        disabled={disabled}
        className={cn(
          "border-line text-text-main placeholder-text-muted focus:border-text-main focus:ring-text-main w-full rounded-md border bg-white px-3 py-2 pl-10 text-base focus:ring-1 focus:outline-none",
          isSearching && "animate-pulse",
          disabled && "bg-white/80",
        )}
      />
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="検索ワードをクリア"
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-icon-muted transition-colors hover:text-text-main"
        >
          <MdClose size={16} aria-hidden="true" focusable="false" />
        </button>
      )}
    </div>
  );
}
