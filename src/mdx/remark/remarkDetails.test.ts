import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import {
  findMdxComponents,
  findMdxEsmNodes,
  getMdxComponent,
  isMdxEsm,
} from "./_testUtils";
import { remarkDetails } from "./remarkDetails";

const runPlugin = (tree: Root) => {
  remarkDetails()(tree);
  return tree;
};

describe("remarkDetails", () => {
  it("transforms basic details block with default title", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content here" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    // Check import was added
    const mdxImports = findMdxEsmNodes(result.children);
    expect(mdxImports).toHaveLength(1);
    expect(mdxImports[0].value).toContain(
      'import { Details } from "../../mdx/components/Details";',
    );

    // Check Details component was created
    const detailsNode = getMdxComponent(result.children, "Details");
    expect(detailsNode.attributes).toEqual([]);
    expect(detailsNode.children).toHaveLength(1);
    expect(detailsNode.children[0]).toMatchObject({
      type: "paragraph",
      children: [{ type: "text", value: "Content here" }],
    });

    // Original paragraphs should be replaced
    expect(
      result.children.filter((child) => child.type === "paragraph"),
    ).toHaveLength(0);
  });

  it("transforms details block with custom title", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details Click to expand" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Hidden content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const detailsNode = getMdxComponent(result.children, "Details");
    expect(detailsNode.attributes).toEqual([
      {
        type: "mdxJsxAttribute",
        name: "summary",
        value: "Click to expand",
      },
    ]);
  });

  it("does not duplicate imports when one already exists", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { Details } from "../../mdx/components/Details";',
        } as any,
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);
    const mdxImports = findMdxEsmNodes(result.children);
    expect(mdxImports).toHaveLength(1);

    const detailsNode = getMdxComponent(result.children, "Details");
    expect(detailsNode).toBeDefined();
  });

  it("ignores details blocks without closing marker", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content without closing" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    // No imports added
    expect(result.children.some(isMdxEsm)).toBe(false);
    // Paragraphs left intact
    expect(
      result.children.filter((child) => child.type === "paragraph"),
    ).toHaveLength(2);
  });

  it("handles multiple details blocks", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details First" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "First content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details Second" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Second content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    // Single import
    const mdxImports = findMdxEsmNodes(result.children);
    expect(mdxImports).toHaveLength(1);

    // Two Details components
    const detailsNodes = findMdxComponents(result.children, "Details");
    expect(detailsNodes).toHaveLength(2);

    // Check first Details
    expect(detailsNodes[0].attributes[0]).toMatchObject({
      type: "mdxJsxAttribute",
      name: "summary",
      value: "First",
    });

    // Check second Details
    expect(detailsNodes[1].attributes[0]).toMatchObject({
      type: "mdxJsxAttribute",
      name: "summary",
      value: "Second",
    });
  });

  it("handles details block with empty content", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: details" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const detailsNode = getMdxComponent(result.children, "Details");
    expect(detailsNode.children).toHaveLength(0);
  });
});
