import type { Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkOgLinks } from "./remarkOgLinks";

const runPlugin = (tree: Root) => {
  remarkOgLinks()(tree);
  return tree;
};

const isMdxImport = (node: RootContent) => (node as any).type === "mdxjsEsm";

describe("remarkOgLinks", () => {
  it("replaces standalone link paragraphs with OG components and injects the import", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://example.com",
              title: null,
              children: [{ type: "text", value: "Example Site" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const ogNode = result.children.find(
      (child) => (child as any).name === "OG",
    ) as any;
    expect(ogNode).toBeDefined();
    expect(ogNode.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "url", value: "https://example.com" },
    ]);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);
    expect((mdxImports[0] as any).value).toContain(
      'import { OG } from "../../mdx/components/OG";',
    );
  });

  it("leaves paragraphs with surrounding text untouched", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Check this " },
            {
              type: "link",
              url: "https://example.com",
              title: null,
              children: [{ type: "text", value: "Example Site" }],
            },
            { type: "text", value: " for details" },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    expect(result.children.some((child) => (child as any).name === "OG")).toBe(
      false,
    );
    expect(result.children.some(isMdxImport)).toBe(false);
  });

  it("does not duplicate imports when one is already present and handles multiple links", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { OG } from "../../mdx/components/OG";',
        } as any,
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://first.example",
              title: null,
              children: [{ type: "text", value: "First" }],
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://second.example",
              title: null,
              children: [{ type: "text", value: "Second" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);

    const ogNodes = result.children.filter(
      (child) => (child as any).name === "OG",
    ) as any[];
    expect(ogNodes).toHaveLength(2);
    expect(ogNodes[0].attributes?.[0]?.value).toBe("https://first.example");
    expect(ogNodes[1].attributes?.[0]?.value).toBe("https://second.example");
  });
});
