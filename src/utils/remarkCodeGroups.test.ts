import { describe, expect, it } from "vitest";
import { remarkCodeGroups } from "./remarkCodeGroups";
import type { Root, RootContent } from "mdast";

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
    expect(mdxImports).toHaveLength(2);
    expect((mdxImports[0] as any).value).toContain(
      'import CodeGroupPanel from "../../components/CodeGroupPanel.astro";',
    );
    expect((mdxImports[1] as any).value).toContain(
      'import CodeGroup from "../../components/CodeGroup.astro";',
    );

    const codeGroup = result.children.find(
      (child) => (child as any).name === "CodeGroup",
    ) as any;
    expect(codeGroup).toBeDefined();

    const panels = codeGroup.children;
    expect(panels).toHaveLength(2);

    const [pnpmPanel, npmPanel] = panels;
    expect(getAttr(pnpmPanel, "label")).toBe("pnpm");
    expect(getAttr(pnpmPanel, "icon")).toBe("mdi:language-typescript");
    expect(getAttr(pnpmPanel, "language")).toBe("ts");
    expect(pnpmPanel.children?.[0]).toMatchObject({
      type: "code",
      lang: "ts",
      meta: "--filter",
      value: "pnpm i",
    });

    expect(getAttr(npmPanel, "label")).toBe("npm");
    expect(getAttr(npmPanel, "icon")).toBe("mdi:console");
    expect(getAttr(npmPanel, "language")).toBe("bash");
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
    expect(getAttr(panel, "label")).toBe("Tab 1");
    expect(getAttr(panel, "icon")).toBe("mdi:language-rust");
    expect(getAttr(panel, "language")).toBe("rust");
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
