import type { Heading, Root, RootContent, Text } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkExtractHeadings } from "./remarkExtractHeadings";

const runPlugin = (tree: Root) => {
  remarkExtractHeadings()(tree);
  return tree;
};

const isMdxExport = (node: RootContent) => (node as any).type === "mdxjsEsm";

const getExportValue = (tree: Root): any => {
  const exportNode = tree.children.find(isMdxExport) as any;
  if (!exportNode) return undefined;

  // Extract JSON from "export const headings = [...];"
  const match = exportNode.value.match(/export const headings = (.+);/);
  return match ? JSON.parse(match[1]) : undefined;
};

describe("remarkExtractHeadings", () => {
  it("extracts multiple headings (h1-h3) and exports them", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "Introduction" }],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Getting Started" }],
        } as Heading,
        {
          type: "heading",
          depth: 3,
          children: [{ type: "text", value: "Installation" }],
        } as Heading,
        {
          type: "paragraph",
          children: [{ type: "text", value: "Some content" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const exportNode = result.children.find(isMdxExport) as any;
    expect(exportNode).toBeDefined();
    expect(exportNode.value).toContain("export const headings =");

    const headings = getExportValue(result);
    expect(headings).toHaveLength(3);

    expect(headings[0]).toEqual({
      depth: 1,
      slug: "introduction",
      text: "Introduction",
    });

    expect(headings[1]).toEqual({
      depth: 2,
      slug: "getting-started",
      text: "Getting Started",
    });

    expect(headings[2]).toEqual({
      depth: 3,
      slug: "installation",
      text: "Installation",
    });
  });

  it("exports empty array when there are no headings", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Just a paragraph" }],
        },
        {
          type: "code",
          lang: "ts",
          value: "const x = 1;",
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const exportNode = result.children.find(isMdxExport) as any;
    expect(exportNode).toBeDefined();

    const headings = getExportValue(result);
    expect(headings).toEqual([]);
  });

  it("ignores headings deeper than h3 (h4, h5, h6)", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "H1 Title" }],
        } as Heading,
        {
          type: "heading",
          depth: 4,
          children: [{ type: "text", value: "H4 Ignored" }],
        } as Heading,
        {
          type: "heading",
          depth: 5,
          children: [{ type: "text", value: "H5 Ignored" }],
        } as Heading,
        {
          type: "heading",
          depth: 6,
          children: [{ type: "text", value: "H6 Ignored" }],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    const headings = getExportValue(result);
    expect(headings).toHaveLength(1);
    expect(headings[0]).toEqual({
      depth: 1,
      slug: "h1-title",
      text: "H1 Title",
    });
  });

  it("extracts text from headings with links and emphasis", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 2,
          children: [
            { type: "text", value: "Using " } as Text,
            {
              type: "link",
              url: "https://example.com",
              children: [{ type: "text", value: "Next.js" } as Text],
            },
            { type: "text", value: " with TypeScript" } as Text,
          ],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [
            { type: "text", value: "This is " } as Text,
            {
              type: "emphasis",
              children: [{ type: "text", value: "important" } as Text],
            },
          ],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    const headings = getExportValue(result);
    expect(headings).toHaveLength(2);

    expect(headings[0]).toEqual({
      depth: 2,
      slug: "using-nextjs-with-typescript",
      text: "Using Next.js with TypeScript",
    });

    expect(headings[1]).toEqual({
      depth: 2,
      slug: "this-is-important",
      text: "This is important",
    });
  });

  it("generates correct slugs with special characters", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "FAQ & Troubleshooting" }],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Node.js v20.0.0" }],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "API Reference: `/api/users`" }],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    const headings = getExportValue(result);
    expect(headings).toHaveLength(3);

    expect(headings[0].slug).toBe("faq--troubleshooting");
    expect(headings[1].slug).toBe("nodejs-v2000");
    expect(headings[2].slug).toBe("api-reference-apiusers");
  });

  it("preserves order of headings", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 3,
          children: [{ type: "text", value: "Third" }],
        } as Heading,
        {
          type: "paragraph",
          children: [{ type: "text", value: "Some text" }],
        },
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "First" }],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Second" }],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    const headings = getExportValue(result);
    expect(headings).toHaveLength(3);

    // Should maintain document order
    expect(headings[0].text).toBe("Third");
    expect(headings[1].text).toBe("First");
    expect(headings[2].text).toBe("Second");
  });

  it("handles empty heading text gracefully", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Valid Heading" }],
        } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "" }],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    const headings = getExportValue(result);
    // Empty heading should be filtered out
    expect(headings).toHaveLength(1);
    expect(headings[0].text).toBe("Valid Heading");
  });

  it("adds export to the beginning of the tree", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "First paragraph" }],
        },
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "Title" }],
        } as Heading,
      ] as any[],
    };

    const result = runPlugin(tree);

    // Export should be the first child
    expect((result.children[0] as any).type).toBe("mdxjsEsm");
    expect((result.children[1] as any).type).toBe("paragraph");
  });
});
