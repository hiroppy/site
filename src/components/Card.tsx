import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { Image, type Props as ImageProps } from "./Image";
import { Link, type Props as LinkProps } from "./Link";

type CardProps = {
  className?: string;
  variant?: "default" | "interactive";
  link?: Omit<LinkProps, "children">;
  ariaLabel?: string;
  id?: string;
  children: ReactNode;
};

export function Card({
  className,
  variant = "default",
  ariaLabel,
  link,
  id,
  children,
}: CardProps) {
  const baseClasses = cn(
    "rounded border bg-bg border-line",
    variant === "interactive" && "overflow-hidden",
    link && "group block cursor-pointer",
    className,
  );

  if (link) {
    return (
      <Link
        {...link}
        className={cn(
          baseClasses,
          "no-underline hover:no-underline focus-visible:shadow-2xl focus-visible:ring-8 focus-visible:shadow-blue-500/50 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:outline-none",
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <div id={id} className={baseClasses} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

type CardContentProps = {
  className?: string;
  children: ReactNode;
};

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("p-4 md:p-6", className)}>{children}</div>;
}

type CardHeaderProps = {
  className?: string;
  children: ReactNode;
};

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

type CardTitleProps = {
  className?: string;
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function CardTitle({ className, children, level = 2 }: CardTitleProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(
        "text-text-main group-hover:text-link font-semibold transition-colors",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type CardDescriptionProps = {
  className?: string;
  children: ReactNode;
};

export function CardDescription({ className, children }: CardDescriptionProps) {
  return <p className={cn("text-text-sub text-sm", className)}>{children}</p>;
}

type CardImageVariant = "thumbnail" | "cover" | "expand";

type CardImageProps = {
  variant?: CardImageVariant;
} & ImageProps;

export function CardImage({
  src,
  alt,
  variant = "cover",
  className,
  lazy,
  ...rest
}: CardImageProps) {
  const variantClasses = {
    thumbnail: "h-20 w-36 object-cover rounded-md shrink-0",
    cover: "h-40 w-full object-cover",
    expand:
      "h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105",
  } satisfies Record<CardImageVariant, string>;

  const variantSizes = {
    thumbnail: { width: 144, height: 80 },
    cover: { width: 400, height: 210 },
    expand: { width: 160, height: 84 },
  } satisfies Record<CardImageVariant, { width: number; height: number }>;

  const imageClass = cn(variantClasses[variant], className);
  const { width, height } = variantSizes[variant];

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={imageClass}
      lazy={lazy}
      {...rest}
    />
  );
}
