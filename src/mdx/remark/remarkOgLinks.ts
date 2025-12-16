import type { Link, Paragraph, Root, RootContent } from "mdast";

const IMPORT_SOURCE = "../../mdx/components/OG";
const IMPORT_VALUE = `import { OG } from "${IMPORT_SOURCE}";`;

type ComponentName = "OG" | "YoutubeCard" | "TwitterCard";

const COMPONENT_IMPORT_PATHS: Record<ComponentName, string> = {
  OG: "../../mdx/components/OG",
  YoutubeCard: "../../mdx/components/YoutubeCard",
  TwitterCard: "../../mdx/components/TwitterCard",
};

function buildImportForComponent(componentName: ComponentName): RootContent {
  const importPath = COMPONENT_IMPORT_PATHS[componentName];
  const importValue = `import { ${componentName} } from "${importPath}";`;

  return {
    type: "mdxjsEsm",
    value: importValue,
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportSpecifier",
                imported: { type: "Identifier", name: componentName },
                local: { type: "Identifier", name: componentName },
              },
            ],
            source: {
              type: "Literal",
              value: importPath,
            },
          },
        ],
      },
    },
  } as unknown as RootContent;
}

function buildOgImport(): RootContent {
  return buildImportForComponent("OG");
}

function buildOgElement(url: string): RootContent {
  return {
    type: "mdxJsxFlowElement",
    name: "OG",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "url",
        value: url,
      },
    ],
    children: [],
  } as unknown as RootContent;
}

function buildYoutubeCard(id: string): RootContent {
  return {
    type: "mdxJsxFlowElement",
    name: "YoutubeCard",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "id",
        value: id,
      },
    ],
    children: [],
  } as unknown as RootContent;
}

function buildTwitterCard(id: string): RootContent {
  return {
    type: "mdxJsxFlowElement",
    name: "TwitterCard",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "id",
        value: id,
      },
    ],
    children: [],
  } as unknown as RootContent;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats.
 * Supports:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 */
function extractYoutubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // youtube.com/watch?v=...
    if (hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
      const videoId = urlObj.searchParams.get("v");
      return videoId && videoId.length === 11 ? videoId : null;
    }

    // youtu.be/VIDEO_ID
    if (hostname.includes("youtu.be")) {
      const videoId = urlObj.pathname.slice(1);
      return videoId && videoId.length === 11 ? videoId : null;
    }

    // youtube.com/embed/VIDEO_ID
    if (
      hostname.includes("youtube.com") &&
      urlObj.pathname.startsWith("/embed/")
    ) {
      const videoId = urlObj.pathname.split("/")[2];
      return videoId && videoId.length === 11 ? videoId : null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts Twitter/X tweet ID from status URLs.
 * Supports:
 * - twitter.com/username/status/TWEET_ID
 * - x.com/username/status/TWEET_ID
 */
function extractTwitterId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // twitter.com or x.com with /status/ path
    if (
      (hostname.includes("twitter.com") || hostname.includes("x.com")) &&
      urlObj.pathname.includes("/status/")
    ) {
      const parts = urlObj.pathname.split("/");
      const statusIndex = parts.indexOf("status");
      if (statusIndex !== -1 && parts.length > statusIndex + 1) {
        const tweetId = parts[statusIndex + 1];
        // Validate that it's a numeric ID
        return tweetId && /^\d+$/.test(tweetId) ? tweetId : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getStandaloneLink(paragraph: Paragraph): Link | null {
  if (!paragraph.children || paragraph.children.length === 0) return null;

  let linkNode: Link | null = null;

  for (const child of paragraph.children) {
    if (child.type === "link") {
      if (linkNode) return null;
      if (!child.url) return null;
      linkNode = child as Link;
      continue;
    }

    if (child.type === "text") {
      if (!child.value || !child.value.trim()) continue;
      return null;
    }

    return null;
  }

  return linkNode;
}

export function remarkOgLinks() {
  return (tree: Root) => {
    const usedComponents = new Set<ComponentName>();

    tree.children = tree.children.map((node) => {
      if (node.type !== "paragraph") return node;

      const standaloneLink = getStandaloneLink(node as Paragraph);
      if (!standaloneLink) return node;

      const url = standaloneLink.url!;

      // Try specialized card components first
      const youtubeId = extractYoutubeId(url);
      if (youtubeId) {
        usedComponents.add("YoutubeCard");
        return buildYoutubeCard(youtubeId);
      }

      const twitterId = extractTwitterId(url);
      if (twitterId) {
        usedComponents.add("TwitterCard");
        return buildTwitterCard(twitterId);
      }

      // Fallback to OG component for other URLs
      usedComponents.add("OG");
      return buildOgElement(url);
    });

    // Add imports for all used components
    if (usedComponents.size === 0) return;

    for (const componentName of usedComponents) {
      const importPath = COMPONENT_IMPORT_PATHS[componentName];
      const hasImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes(componentName) &&
          child.value.includes(importPath),
      );

      if (!hasImport) {
        tree.children.unshift(buildImportForComponent(componentName));
      }
    }
  };
}
