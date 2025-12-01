import { cn } from "../utils/cn";

type Props = {
  icon: string;
  className?: string;
  width?: string | number;
  height?: string | number;
};

// Declare the custom element for TypeScript
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "iconify-icon": {
        icon: string;
        class?: string;
        width?: string;
        height?: string;
      };
    }
  }
}

export function Icon({
  icon,
  className,
  width = "1em",
  height = "1em",
}: Props) {
  return (
    <iconify-icon
      icon={icon}
      class={cn("text-current", className)}
      width={String(width)}
      height={String(height)}
    />
  );
}
