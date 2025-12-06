import type { Metadata } from "next";

export function createMetadata(options: {
  path: string;
  title: string;
  description: string;
  openGraph?: Omit<Metadata["openGraph"], "url">;
}): Metadata {
  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: options.path,
    },
    openGraph: {
      url: options.path,
      ...options.openGraph,
    },
  };
}
