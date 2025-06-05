import { defineCollection, z } from "astro:content";

const AVAILABLE_TAGS = [
  "node.js",
  "life",
  "job",
  "javascript",
  "webpack",
  "oss",
  "github",
  "astro",
  "testing",
  "ssr",
  "next.js",
  "tutorial",
  "conference",
  "web-api",
  "template",
  "site",
  "pwa",
  "npm",
  "git",
  "environment",
  "docker",
] as const;

const blogCollection = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.string().refine(
      (tags) => {
        const tagList = tags.split(",").map((tag) => tag.trim());
        return tagList.every((tag) => AVAILABLE_TAGS.includes(tag as any));
      },
      {
        message: `Tags must be one of: ${AVAILABLE_TAGS.join(", ")}`,
      },
    ),
    // 以前のhatenablogのpath
    hatenaPath: z.string().optional(),
  }),
});

export const collections = <const>{
  blog: blogCollection,
};
