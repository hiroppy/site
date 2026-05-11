import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import { findMdxEsmNodes, getMdxComponent, isMdxEsm } from "./_testUtils";
import { remarkAlerts } from "./remarkAlerts";

const runPlugin = (tree: Root) => {
  remarkAlerts()(tree);
  return tree;
};

describe("remarkAlerts", () => {
  it("wraps blockquotes with alert markers and injects a single import", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "blockquote",
          children: [
            {
              type: "paragraph",
              children: [
                { type: "text", value: "[!WARNING] Be careful" },
                { type: "text", value: " around here" },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "next" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const mdxImports = findMdxEsmNodes(result.children);
    expect(mdxImports).toHaveLength(1);
    expect(mdxImports[0].value).toContain(
      'import { Alert } from "../../mdx/components/Alert";',
    );

    const alertNode = getMdxComponent(result.children, "Alert");
    expect(alertNode.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "type", value: "warning" },
    ]);
    expect(alertNode.children?.[0]).toMatchObject({
      type: "paragraph",
      children: [
        { type: "text", value: "Be careful" },
        { type: "text", value: " around here" },
      ],
    });

    // Original blockquote should be replaced entirely.
    expect(result.children.some((child) => child.type === "blockquote")).toBe(
      false,
    );
  });

  it("does not duplicate imports when one already exists", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { Alert } from "../../mdx/components/Alert";',
        } as any,
        {
          type: "blockquote",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: "[!TIP] Nice" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);
    const mdxImports = findMdxEsmNodes(result.children);
    expect(mdxImports).toHaveLength(1);

    const alertNode = getMdxComponent(result.children, "Alert");
    expect(alertNode.attributes?.[0]?.value).toBe("tip");
  });

  it("ignores blockquotes without alert markers", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "blockquote",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: "Regular quote" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    // No imports added
    expect(result.children.some(isMdxEsm)).toBe(false);
    // Blockquote left intact
    expect(result.children.some((child) => child.type === "blockquote")).toBe(
      true,
    );
  });
});
