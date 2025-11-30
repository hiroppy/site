import type { ImageMetadata } from "astro";
import { getImageSrc } from "../utils/importAssets";

type Props = {
  src: string | ImageMetadata;
  alt: string;
  class?: string;
  className?: string;
  lazy?: boolean;
  width?: number;
  height?: number;
};

const placeholderColor =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcfPRvPQAHHgLWeG8FbgAAAABJRU5ErkJggg==";

export function Image({
  src,
  alt,
  class: classNameProp,
  className,
  lazy = true,
  width,
  height,
}: Props) {
  const loading = lazy ? "lazy" : "eager";
  const finalClassName = classNameProp || className;

  // Handle empty src
  if (src === "") {
    return (
      <div
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
          background: `url('${placeholderColor}')`,
        }}
        className={finalClassName}
      />
    );
  }

  // Handle external URLs
  if (typeof src === "string" && src.startsWith("http")) {
    return (
      <img
        src={src}
        className={finalClassName}
        alt={alt}
        width={width ?? 0}
        height={height ?? 0}
        loading={loading}
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
      className={finalClassName}
      alt={alt}
      width={width ?? 0}
      height={height ?? 0}
      loading={loading}
      onError={(e) => {
        const target = e.currentTarget;
        target.onerror = null;
        target.src = placeholderColor;
      }}
      decoding="async"
    />
  );
}
