#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const SOURCE_IMAGES_DIR = "node_modules/hiroppy/generated/images";
const SOURCE_JSON_DIR = "node_modules/hiroppy/generated";
const TARGET_IMAGES_DIR = "public/images/generated";

function copyHiroppyImages() {
  console.log("📦 Copying images from hiroppy package...");

  // Check if source directory exists
  if (!existsSync(SOURCE_IMAGES_DIR)) {
    console.log("ℹ️  No images found in hiroppy package. Skipping copy.");
    return;
  }

  try {
    // Remove target directory if it exists
    if (existsSync(TARGET_IMAGES_DIR)) {
      console.log("🗑️  Cleaning existing generated images directory...");
      rmSync(TARGET_IMAGES_DIR, { recursive: true, force: true });
    }

    // Create target directory
    mkdirSync(TARGET_IMAGES_DIR, { recursive: true });

    // Copy all image files from source to target
    const imageFiles = readdirSync(SOURCE_IMAGES_DIR);
    let copiedImageCount = 0;

    for (const file of imageFiles) {
      const sourcePath = join(SOURCE_IMAGES_DIR, file);
      const targetPath = join(TARGET_IMAGES_DIR, file);

      copyFileSync(sourcePath, targetPath);
      copiedImageCount++;
    }

    console.log(
      `✅ Successfully copied ${copiedImageCount} images to ${TARGET_IMAGES_DIR}`,
    );

    // Update JSON files in node_modules to point to /images/generated/
    const jsonFiles = readdirSync(SOURCE_JSON_DIR).filter((file) =>
      file.endsWith(".json"),
    );

    for (const file of jsonFiles) {
      const jsonPath = join(SOURCE_JSON_DIR, file);

      // Read JSON file
      const content = readFileSync(jsonPath, "utf-8");

      // Check if it contains /images/ paths that need updating
      if (
        content.includes("/images/") &&
        !content.includes("/images/generated/") &&
        !content.includes("/images/blog/") &&
        !content.includes("/images/brands/")
      ) {
        // Update image paths from /images/ to /images/generated/
        const updatedContent = content.replace(
          /\/images\/([A-Za-z0-9+/=_-]+\.(jpg|webp|png))/g,
          "/images/generated/$1",
        );

        // Write back to node_modules
        writeFileSync(jsonPath, updatedContent, "utf-8");
        console.log(`✅ Updated image paths in ${file}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to copy files:", error);
    process.exit(1);
  }
}

copyHiroppyImages();
