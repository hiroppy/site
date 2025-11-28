import type { ImageMetadata } from "astro";
import { describe, expect, it } from "vitest";

import { getImageSrc, importAssets } from "./importAssets";

const LOCAL_IMAGE = "/images/meta/me.png";
const GENERATED_IMAGE = "/images/MjAyNS50c2thaWdpLm9yZy9iYW5uZXIuanBn.webp";

describe("importAssets", () => {
  it("resolves local images from the manifest", () => {
    const resolved = importAssets(LOCAL_IMAGE);

    expect(resolved).not.toBe(LOCAL_IMAGE);
    expect(getImageSrc(LOCAL_IMAGE)).toContain("me");
  });

  it("resolves generated images from the manifest", () => {
    const resolved = importAssets(GENERATED_IMAGE);

    expect(resolved).not.toBe(GENERATED_IMAGE);
    expect(typeof resolved).toBe("string");
  });

  it("passes through remote URLs", () => {
    const remote = "https://example.com/image.png";

    expect(importAssets(remote)).toBe(remote);
    expect(getImageSrc(remote)).toBe(remote);
  });

  it("returns the input for unknown images", () => {
    const unknown = "/images/does-not-exist.png";

    expect(importAssets(unknown)).toBe(unknown);
    expect(getImageSrc(unknown)).toBe(unknown);
  });

  it("returns the original object when ImageMetadata is provided", () => {
    const meta = {
      src: "/images/custom.png",
      width: 100,
      height: 100,
      format: "png",
    } satisfies ImageMetadata;

    expect(importAssets(meta)).toBe(meta);
    expect(getImageSrc(meta)).toBe(meta.src);
  });

  it("unwraps default-exported ImageMetadata modules", () => {
    const meta = {
      src: "/images/default.png",
      width: 100,
      height: 100,
      format: "png",
    } satisfies ImageMetadata;

    expect(getImageSrc({ default: meta })).toBe(meta.src);
  });
});
