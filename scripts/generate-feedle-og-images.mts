#!/usr/bin/env node
/**
 * Generate static OG images for Feedle pages
 *
 * This script generates OG (Open Graph) images for the Feedle pages using the
 * existing generatePageOgImage function from src/utils/ogp.ts.
 * The images are saved to the public directory to be served statically.
 *
 * Generated images:
 * - /labs/feedle/og.png (general feedle page)
 * - /labs/feedle/frontend/og.png (frontend specific page)
 * - /labs/feedle/ai/og.png (ai specific page)
 *
 * Usage: pnpm generate:feedle-og
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { createPageOgTemplate } from "../src/utils/ogTemplates.ts";

const outputDir = join(process.cwd(), "public", "labs", "feedle");

// Load font and icon for OG image generation
const font = await readFile(
  join(process.cwd(), "src/assets/fonts/NotoSansJP-SemiBold.ttf"),
);
const iconData = await readFile(
  join(process.cwd(), "src/assets/images/meta/me.png"),
);
const iconBase64 = iconData.toString("base64");

// Ensure directories exist
async function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}

// Generate OG image using the template from src/utils/ogTemplates.ts
async function generatePageOgImage(
  title: string,
  pageType: string,
  description?: string,
) {
  const template = createPageOgTemplate({
    title,
    pageType,
    description,
    iconBase64,
  });

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "NotoSansJP",
        data: font,
      },
    ],
  });
  const res = await sharp(Buffer.from(svg)).png().toBuffer();
  return res;
}

// OG image configurations for Feedle pages
const ogConfigs = [
  {
    path: "og.png",
    title: "Feedle",
    pageType: "Hiroppy Labs",
    description: "A feed reader playground built with modern web technologies",
  },
  {
    path: "frontend/og.png",
    title: "Feedle Frontend",
    pageType: "Hiroppy Labs",
    description: "フロントエンド関連の情報を集めるサービス",
  },
  {
    path: "ai/og.png",
    title: "Feedle AI",
    pageType: "Hiroppy Labs",
    description: "AI関連の情報を集めるサービス",
  },
];

async function generateOgImages() {
  console.log("🎨 Generating Feedle OG images...");

  for (const config of ogConfigs) {
    try {
      console.log(`  📝 Generating ${config.path}...`);

      const imageBuffer = await generatePageOgImage(
        config.title,
        config.pageType,
        config.description,
      );

      const outputPath = join(outputDir, config.path);
      await ensureDir(outputPath);
      await writeFile(outputPath, new Uint8Array(imageBuffer));

      console.log(`  ✅ Generated ${config.path}`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${config.path}:`, error);
      process.exit(1);
    }
  }

  console.log("🎉 All Feedle OG images generated successfully!");
}

generateOgImages().catch((error) => {
  console.error("Failed to generate OG images:", error);
  process.exit(1);
});
