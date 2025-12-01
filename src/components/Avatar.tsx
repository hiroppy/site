import { cn } from "../utils/cn";
import { Image } from "./Image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  lazy?: boolean;
};

export function Avatar({ src, alt, className, size = "md", lazy }: Props) {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 128,
  };

  const classes = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    size === "xs" && "h-6 w-6",
    size === "sm" && "h-8 w-8",
    size === "md" && "h-10 w-10",
    size === "lg" && "h-12 w-12",
    size === "xl" && "h-32 w-32",
    className,
  );

  return (
    <span className={classes}>
      <Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        width={sizeMap[size]}
        height={sizeMap[size]}
        lazy={lazy}
      />
    </span>
  );
}
