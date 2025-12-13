import type { Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkCodeGroups } from "./remarkCodeGroups";

const runPlugin = (tree: Root) => {
  remarkCodeGroups()(tree);
  return tree;
};

const getAttr = (panel: any, name: string) =>
  panel.attributes.find((attr: any) => attr.name === name)?.value;

const isMdxImport = (node: RootContent) => (node as any).type === "mdxjsEsm";

describe("remarkCodeGroups", () => {
  it("converts code-group fences into CodeGroup with panels and imports", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: code-group" }],
        },
        {
          type: "code",
          lang: "ts",
          meta: "[pnpm] --filter",
          value: "pnpm i",
        },
        {
          type: "code",
          lang: "bash",
          meta: "[npm]",
          value: "npm i",
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
      'import { CodeGroup } from "../../mdx/components/CodeGroup";',
    );

    const codeGroup = result.children.find(
      (child) => (child as any).name === "CodeGroup",
    ) as any;
    expect(codeGroup).toBeDefined();
    expect(codeGroup.attributes).toEqual([]);

    const panels = codeGroup.children;
    expect(panels).toHaveLength(2);

    const [pnpmPanel, npmPanel] = panels;
    expect(getAttr(pnpmPanel, "className")).toBe("code-group-panel");
    expect(getAttr(pnpmPanel, "data-label")).toBe("pnpm");
    expect(getAttr(pnpmPanel, "data-icon")).toBe("typescript");
    expect(getAttr(pnpmPanel, "data-language")).toBe("ts");
    expect(pnpmPanel.children?.[0]).toMatchObject({
      type: "code",
      lang: "ts",
      meta: "--filter",
      value: "pnpm i",
    });

    expect(getAttr(npmPanel, "className")).toBe("code-group-panel");
    expect(getAttr(npmPanel, "data-label")).toBe("npm");
    expect(getAttr(npmPanel, "data-icon")).toBe("console");
    expect(getAttr(npmPanel, "data-language")).toBe("bash");
    expect(npmPanel.children?.[0]).toMatchObject({
      type: "code",
      lang: "bash",
      meta: "",
      value: "npm i",
    });
  });

  it("falls back to default labels when meta is missing", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: code-group" }],
        },
        {
          type: "code",
          lang: "rust",
          value: "fn main() {}",
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);
    const codeGroup = result.children.find(
      (child) => (child as any).name === "CodeGroup",
    ) as any;
    expect(codeGroup).toBeDefined();

    const [panel] = codeGroup.children;
    expect(getAttr(panel, "className")).toBe("code-group-panel");
    expect(getAttr(panel, "data-label")).toBe("Tab 1");
    expect(getAttr(panel, "data-icon")).toBe("file-code");
    expect(getAttr(panel, "data-language")).toBe("rust");
  });

  it("ignores sections without code blocks (no imports or replacements)", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: code-group" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "just text" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    // No imports added
    expect(result.children.some(isMdxImport)).toBe(false);
    // Original paragraphs remain (no CodeGroup injected)
    expect(
      result.children.some((child) => (child as any).name === "CodeGroup"),
    ).toBe(false);
  });
});
