import NextImage, { type StaticImageData } from "next/image";
import type { ComponentProps } from "react";

type NextImageProps = ComponentProps<typeof NextImage>;

type Props = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  lazy?: boolean;
  width?: number;
  height?: number;
  fetchPriority?: NextImageProps["fetchPriority"];
  fill?: boolean;
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export function Image({
  src,
  alt,
  className,
  lazy = true,
  width,
  height,
  fetchPriority,
  fill = false,
}: Props) {
  const loading: NextImageProps["loading"] = lazy ? "lazy" : "eager";
  const priority = fetchPriority === "high";

  if (src === "") {
    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "auto",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  if (typeof src === "string" && src.startsWith("http")) {
    return (
      <NextImage
        src={src}
        alt={alt}
        className={className}
        width={width ?? DEFAULT_WIDTH}
        height={height ?? DEFAULT_HEIGHT}
        loading={loading}
        priority={priority}
        unoptimized={true}
      />
    );
  }

  // Handle local images
  const imageSrc = typeof src === "string" ? src : src.src;
  const commonProps = {
    src: imageSrc,
    alt,
    className,
    loading,
    priority,
  };

  if (fill) {
    return <NextImage {...commonProps} fill />;
  }

  return (
    <NextImage
      {...commonProps}
      width={width ?? DEFAULT_WIDTH}
      height={height ?? DEFAULT_HEIGHT}
    />
  );
}
