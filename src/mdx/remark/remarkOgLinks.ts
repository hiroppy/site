import type { Link, Paragraph, Root, RootContent } from "mdast";

const IMPORT_SOURCE = "../../mdx/components/OG";
const IMPORT_VALUE = `import { OG } from "${IMPORT_SOURCE}";`;

function buildOgImport(): RootContent {
  return {
    type: "mdxjsEsm",
    value: IMPORT_VALUE,
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportSpecifier",
                imported: { type: "Identifier", name: "OG" },
                local: { type: "Identifier", name: "OG" },
              },
            ],
            source: {
              type: "Literal",
              value: IMPORT_SOURCE,
            },
          },
        ],
      },
    },
  } as unknown as RootContent;
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
    let replacedCount = 0;

    tree.children = tree.children.map((node) => {
      if (node.type !== "paragraph") return node;

      const standaloneLink = getStandaloneLink(node as Paragraph);
      if (!standaloneLink) return node;

      replacedCount++;
      return buildOgElement(standaloneLink.url!);
    });

    if (replacedCount === 0) return;

    const hasImport = tree.children.some(
      (child) =>
        "value" in child &&
        typeof child.value === "string" &&
        child.value.includes("OG") &&
        child.value.includes(IMPORT_SOURCE),
    );

    if (!hasImport) {
      tree.children.unshift(buildOgImport());
    }
  };
}
