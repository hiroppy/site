import { Icon } from "../Icon";
import { cn } from "../../utils/cn";
import { commonStyles } from "../../utils/commonStyles";

type Props = {
  id: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onInput?: (event: Event) => void;
};

export function SearchInput({
  id,
  placeholder = "Search...",
  className,
  value,
  onInput,
}: Props) {
  return (
    <div class={cn("relative", className)}>
      <Icon
        icon="mdi:magnify"
        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
      />
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onInput={onInput}
        class={cn(
          "w-full cursor-text rounded-lg py-2 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none",
          commonStyles.inputBase,
        )}
      />
    </div>
  );
}
