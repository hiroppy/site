import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { createPageOgTemplate, createBlogOgTemplate } from "./ogTemplates.ts";

const { font, iconBase64 } = await (async () => {
  if (import.meta.env.PROD || process.env.NODE_ENV === "test") {
    const font = await readFile(
      join(process.cwd(), "src/assets/fonts/NotoSansJP-SemiBold.ttf"),
    );
    const iconData = await readFile(
      join(process.cwd(), "src/assets/images/meta/me.png"),
    );
    const iconBase64 = iconData.toString("base64");

    return {
      font,
      iconBase64,
    };
  }

  return {
    font: null,
    iconBase64: null,
  };
})();

export async function generatePageOgImage(
  title: string,
  pageType: string,
  description?: string,
) {
  const template = createPageOgTemplate({
    title,
    pageType,
    description,
    iconBase64: iconBase64!,
  });

  // @ts-expect-error TODO:
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "NotoSansJP",
        data: font as Buffer,
      },
    ],
  });
  const res = await sharp(Buffer.from(svg)).png().toBuffer();

  return res;
}

export async function generateOgImage(title: string, tags: string[]) {
  const template = createBlogOgTemplate({
    title,
    iconBase64: iconBase64!,
    tags,
  });

  // @ts-expect-error TODO:
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "NotoSansJP",
        data: font as Buffer,
      },
    ],
  });
  const res = await sharp(Buffer.from(svg)).png().toBuffer();

  return res;
}
