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
  "e2e",
] as const;

const blogCollection = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.string().refine(
      (tags: string) => {
        const tagList = tags.split(",").map((tag) => tag.trim());
        return tagList.every((tag) =>
          (AVAILABLE_TAGS as readonly string[]).includes(tag),
        );
      },
      {
        message: `Tags must be one of: ${AVAILABLE_TAGS.join(", ")}`,
      },
    ),
    // 以前のhatenablogのpath
    hatenaPath: z.string().optional(),
    // 参考文献のURL配列
    references: z.array(z.string().url()).optional(),
  }),
});

export const collections = <const>{
  blog: blogCollection,
};
