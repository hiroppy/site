import { cn } from "../_utils/cn";
import { Icon } from "./Icon";
import { Image } from "./Image";

type CardImageVariant = "thumbnail" | "cover" | "hero" | "mini" | "expand";

type Props = {
  src: string | undefined;
  alt: string;
  variant?: CardImageVariant;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  lazy?: boolean;
};

const variantClasses = {
  thumbnail: "h-20 w-36 object-cover rounded-md shrink-0",
  cover: "h-40 w-full object-cover",
  hero: "h-full w-full object-cover",
  mini: "h-24 w-full object-cover",
  expand:
    "h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105",
};

const variantContainerClasses = {
  thumbnail: "h-20 w-36 rounded-md shrink-0",
  cover: "h-40 w-full",
  hero: "h-full w-full",
  mini: "h-24 w-full",
  expand: "h-full w-full",
};

const variantSizes = {
  thumbnail: { width: 152, height: 80 },
  cover: { width: 400, height: 210 },
  hero: { width: 384, height: 202 },
  mini: { width: 160, height: 84 },
  expand: { width: 160, height: 84 },
};

export function CardImage({
  src,
  alt,
  variant = "cover",
  className,
  lazy,
}: Props) {
  const imageClass = cn(variantClasses[variant], className);
  const containerClass = cn(variantContainerClasses[variant], className);
  const { width, height } = variantSizes[variant];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClass}
        lazy={lazy}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200",
        containerClass,
      )}
    >
      <div className="text-center">
        <Icon
          icon="mdi:image-outline"
          className="mx-auto mb-2 h-8 w-8 text-gray-600"
        />
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    </div>
  );
}
