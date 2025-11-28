import type { ImageMetadata } from "astro";

type ImageType =
  | string
  | ImageMetadata
  | {
      default: ImageMetadata;
    };

type ImageModule = ImageMetadata | string;

const localImages = import.meta.glob(
  "../assets/images/**/*.{webp,jpg,jpeg,png,svg,gif}",
  {
    eager: true,
    import: "default",
  },
);

const generatedImages = import.meta.glob(
  "../../node_modules/hiroppy/generated/images/*.{webp,jpg,jpeg,png,svg,gif}",
  {
    eager: true,
    import: "default",
  },
);

function buildManifest(modules: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(modules).flatMap(([path, mod]) => {
      const idx = path.lastIndexOf("/images/");
      const normalized =
        idx >= 0
          ? path.slice(idx + "/images/".length)
          : path.replace(/^\.\//, "");
      const imagePath = normalized.replace(/^\//, "");

      return [
        [`/images/${imagePath}`, mod as ImageModule],
        [`/assets/images/${imagePath}`, mod as ImageModule],
      ];
    }),
  );
}

const imageManifest: Record<string, ImageModule> = {
  ...buildManifest(localImages),
  ...buildManifest(generatedImages),
};

export function importAssets(image: string | ImageMetadata) {
  if (typeof image === "object" || !image || image.startsWith("http")) {
    return image;
  }

  return imageManifest[image] ?? image;
}

export function getImageSrc(image: ImageType) {
  const resolved = typeof image === "string" ? importAssets(image) : image;

  if (typeof resolved === "string") {
    return resolved;
  }

  if (Reflect.has(resolved, "default")) {
    return (resolved as { default: ImageMetadata }).default.src;
  }

  return (resolved as ImageMetadata).src;
}
