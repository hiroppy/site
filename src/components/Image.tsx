import type { ImageMetadata } from "astro";
import { getImageSrc } from "../utils/importAssets";

type Props = {
  src: string | ImageMetadata;
  alt: string;
  className?: string;
  lazy?: boolean;
  width?: number;
  height?: number;
  fetchPriority?: "auto" | "high" | "low";
};

const placeholderColor =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcfPRvPQAHHgLWeG8FbgAAAABJRU5ErkJggg==";

export function Image({
  src,
  alt,
  className,
  lazy = true,
  width,
  height,
  fetchPriority,
}: Props) {
  const loading = lazy ? "lazy" : "eager";

  if (src === "") {
    return (
      <img
        src={placeholderColor}
        alt={alt}
        className={className}
        width={width ?? 0}
        height={height ?? 0}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    );
  }

  if (typeof src === "string" && src.startsWith("http")) {
    return (
      <img
        src={src}
        className={className}
        alt={alt}
        width={width ?? 0}
        height={height ?? 0}
        loading={loading}
        fetchPriority={fetchPriority}
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = placeholderColor;
        }}
        decoding="async"
      />
    );
  }

  // Handle local images
  const imageSrc = getImageSrc(src);

  return (
    <img
      src={imageSrc}
      className={className}
      alt={alt}
      width={width ?? 0}
      height={height ?? 0}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={(e) => {
        const target = e.currentTarget;
        target.onerror = null;
        target.src = placeholderColor;
      }}
      decoding="async"
    />
  );
}
