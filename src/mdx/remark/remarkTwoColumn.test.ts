import type { Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkTwoColumn } from "./remarkTwoColumn";

const runPlugin = (tree: Root) => {
  remarkTwoColumn()(tree);
  return tree;
};

const getAttr = (component: any, name: string) =>
  component.attributes.find((attr: any) => attr.name === name)?.value;

const isMdxImport = (node: RootContent) => (node as any).type === "mdxjsEsm";

describe("remarkTwoColumn", () => {
  it("transforms columns block with defaults (ratio=1:1, gap=md)", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Left content" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);
    expect((mdxImports[0] as any).value).toContain(
      'import { TwoColumn } from "../../mdx/components/TwoColumn";',
    );

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(twoColumn).toBeDefined();
    expect(getAttr(twoColumn, "ratio")).toBe("1:1");
    expect(getAttr(twoColumn, "gap")).toBe("md");

    const [leftDiv, rightDiv] = twoColumn.children;
    expect(leftDiv.name).toBe("div");
    expect(rightDiv.name).toBe("div");
    expect(leftDiv.children).toHaveLength(1);
    expect(rightDiv.children).toHaveLength(1);
  });

  it("transforms columns block with custom ratio and gap", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 2:1 lg" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Wide left" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Narrow right" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(twoColumn).toBeDefined();
    expect(getAttr(twoColumn, "ratio")).toBe("2:1");
    expect(getAttr(twoColumn, "gap")).toBe("lg");
  });

  it("transforms columns block with only ratio specified", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 1:2" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "More content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(getAttr(twoColumn, "ratio")).toBe("1:2");
    expect(getAttr(twoColumn, "gap")).toBe("md");
  });

  it("splits content at thematicBreak into two divs", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Left 1" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Left 2" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right 1" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right 2" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children).toHaveLength(2);
    expect(rightDiv.children).toHaveLength(2);
  });

  it("handles content with no separator (all in left column)", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Only left content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children).toHaveLength(1);
    expect(rightDiv.children).toHaveLength(0);
  });

  it("handles multiple separators (uses only first)", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Left" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right first" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right second" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children).toHaveLength(1);
    // Right column gets everything after first separator
    expect(rightDiv.children).toHaveLength(3); // paragraph + thematicBreak + paragraph
  });

  it("handles empty left column", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Right only" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children).toHaveLength(0);
    expect(rightDiv.children).toHaveLength(1);
  });

  it("handles empty right column", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Left only" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children).toHaveLength(1);
    expect(rightDiv.children).toHaveLength(0);
  });

  it("handles completely empty columns block", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(twoColumn).toBeDefined();

    const [leftDiv, rightDiv] = twoColumn.children;
    expect(leftDiv.children).toHaveLength(0);
    expect(rightDiv.children).toHaveLength(0);
  });

  it("ignores columns block without closing marker", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    expect(result.children.some(isMdxImport)).toBe(false);
    expect(
      result.children.some((child) => (child as any).name === "TwoColumn"),
    ).toBe(false);
  });

  it("falls back to defaults for invalid ratio", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 99:99 lg" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(getAttr(twoColumn, "ratio")).toBe("1:1");
    expect(getAttr(twoColumn, "gap")).toBe("lg");
  });

  it("falls back to defaults for invalid gap", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 2:1 xl" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    expect(getAttr(twoColumn, "ratio")).toBe("2:1");
    expect(getAttr(twoColumn, "gap")).toBe("md");
  });

  it("does not duplicate import when one already exists", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { TwoColumn } from "../../mdx/components/TwoColumn";',
          data: { estree: {} },
        } as any,
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Content" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);
  });

  it("handles multiple columns blocks in one document", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 1:1" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "First left" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "First right" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Between content" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns 2:1 lg" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Second left" }],
        },
        {
          type: "thematicBreak",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Second right" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumns = result.children.filter(
      (child) => (child as any).name === "TwoColumn",
    );
    expect(twoColumns).toHaveLength(2);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);

    expect(getAttr(twoColumns[0], "ratio")).toBe("1:1");
    expect(getAttr(twoColumns[0], "gap")).toBe("md");
    expect(getAttr(twoColumns[1], "ratio")).toBe("2:1");
    expect(getAttr(twoColumns[1], "gap")).toBe("lg");
  });

  it("preserves nested MDX elements in columns", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: columns" }],
        },
        {
          type: "code",
          lang: "typescript",
          value: "const foo = 'bar';",
        },
        {
          type: "thematicBreak",
        },
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Title" }],
        },
        {
          type: "list",
          ordered: false,
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "text", value: "Item 1" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const twoColumn = result.children.find(
      (child) => (child as any).name === "TwoColumn",
    ) as any;
    const [leftDiv, rightDiv] = twoColumn.children;

    expect(leftDiv.children[0].type).toBe("code");
    expect(rightDiv.children[0].type).toBe("heading");
    expect(rightDiv.children[1].type).toBe("list");
  });
});
