"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "../utils/cn";

// TODO: refactor
export type Props = ImageProps & {
  lazy?: boolean;
};

export function Image({
  src,
  className,
  lazy = true,
  width = 800,
  height = 400,
  ...rest
}: Props) {
  const [isError, setIsError] = useState(false);
  const loading: ImageProps["loading"] = lazy ? "lazy" : "eager";

  if (src === "" || isError) {
    return (
      <div
        className={cn("from-gray-100 to-gray-200 bg-linear-to-br", className)}
      />
    );
  }

  return (
    <NextImage
      src={src}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={() => {
        setIsError(true);
      }}
      {...rest}
    />
  );
}
