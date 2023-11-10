import { parse } from "node:path";
import type { ImageMetadata } from "astro";

type ImageType =
  | string
  | ImageMetadata
  | {
      default: ImageMetadata;
    };

export async function importAssets(
  image: string | ImageMetadata,
): Promise<ImageType> {
  if (typeof image === "object" || !image || image.startsWith("http")) {
    return image;
  }

  try {
    const filename = parse(image);
    const name = filename.name;
    const ext = filename.ext;
    const parts = image.split("/");
    const kind = parts[2];

    if (kind === "brands" || kind === "external" || kind === "meta") {
      switch (ext) {
        case ".webp":
          return import(`../../assets/images/${kind}/${name}.webp`);
        case ".jpg":
          return import(`../assets/images/${kind}/${name}.jpg`);
        case ".png":
          return import(`../assets/images/${kind}/${name}.png`);
        case ".svg":
          return import(`../assets/images/${kind}/${name}.svg`);
        case ".gif":
          return import(`../assets/images/${kind}/${name}.gif`);
        case ".jpeg":
          return import(`../assets/images/${kind}/${name}.jpeg`);
        default:
          return import(`../assets/images/${kind}/${name}.jpg`);
      }
    }

    if (kind === "blog") {
      const blog = parts[3];

      switch (ext) {
        case ".webp":
          return import(`../assets/images/${kind}/${blog}/${name}.webp`);
        case ".jpg":
          return import(`../assets/images/${kind}/${blog}/${name}.jpg`);
        case ".png":
          return import(`../assets/images/${kind}/${blog}/${name}.png`);
        case ".svg":
          return import(`../assets/images/${kind}/${blog}/${name}.svg`);
        case ".gif":
          return import(`../assets/images/${kind}/${blog}/${name}.gif`);
        case ".jpeg":
          return import(`../assets/images/${kind}/${blog}/${name}.jpeg`);
        default:
          return import(`../assets/images/${kind}/${blog}/${name}.jpg`);
      }
    }

    return image;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
    return image;
  }
}

export function getImageSrc(image: ImageType) {
  if (typeof image === "string") {
    return image;
  }

  if (Reflect.has(image, "default")) {
    return (image as { default: ImageMetadata }).default.src;
  }

  return (image as ImageMetadata).src;
}
