import type { Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import {
  buildEsmImport,
  ensureComponentImport,
  hasComponentImport,
} from "./_utils";

describe("buildEsmImport", () => {
  it("builds an mdxjsEsm node with the expected value string", () => {
    const node = buildEsmImport("Alert", "../../mdx/components/Alert");
    expect((node as any).type).toBe("mdxjsEsm");
    expect((node as any).value).toBe(
      'import { Alert } from "../../mdx/components/Alert";',
    );
  });

  it("includes a valid estree ImportDeclaration with sourceType module", () => {
    const node = buildEsmImport("Details", "../../mdx/components/Details");
    const program = (node as any).data.estree;
    expect(program.type).toBe("Program");
    expect(program.sourceType).toBe("module");
    expect(program.body).toHaveLength(1);

    const decl = program.body[0];
    expect(decl.type).toBe("ImportDeclaration");
    expect(decl.source).toEqual({
      type: "Literal",
      value: "../../mdx/components/Details",
    });
    expect(decl.specifiers).toHaveLength(1);
    expect(decl.specifiers[0]).toEqual({
      type: "ImportSpecifier",
      imported: { type: "Identifier", name: "Details" },
      local: { type: "Identifier", name: "Details" },
    });
  });
});

describe("hasComponentImport", () => {
  const componentName = "Alert";
  const importPath = "../../mdx/components/Alert";

  it("returns true when matching mdxjsEsm import already exists", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { Alert } from "../../mdx/components/Alert";',
        } as any,
      ],
    };
    expect(hasComponentImport(tree, componentName, importPath)).toBe(true);
  });

  it("returns false when no import matches", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { Other } from "../../mdx/components/Other";',
        } as any,
      ],
    };
    expect(hasComponentImport(tree, componentName, importPath)).toBe(false);
  });

  it("returns false on empty tree", () => {
    const tree: Root = { type: "root", children: [] };
    expect(hasComponentImport(tree, componentName, importPath)).toBe(false);
  });

  it("ignores nodes without a string value field", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Alert ../../mdx/components/Alert" }],
        },
      ] as RootContent[],
    };
    expect(hasComponentImport(tree, componentName, importPath)).toBe(false);
  });
});

describe("ensureComponentImport", () => {
  it("prepends an import when none exists", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "body" }],
        },
      ] as RootContent[],
    };

    ensureComponentImport(tree, "Alert", "../../mdx/components/Alert");

    expect(tree.children).toHaveLength(2);
    expect((tree.children[0] as any).type).toBe("mdxjsEsm");
    expect((tree.children[0] as any).value).toBe(
      'import { Alert } from "../../mdx/components/Alert";',
    );
  });

  it("does not duplicate an existing matching import", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { Alert } from "../../mdx/components/Alert";',
        } as any,
        {
          type: "paragraph",
          children: [{ type: "text", value: "body" }],
        },
      ] as RootContent[],
    };

    ensureComponentImport(tree, "Alert", "../../mdx/components/Alert");

    const imports = tree.children.filter(
      (child) => (child as any).type === "mdxjsEsm",
    );
    expect(imports).toHaveLength(1);
  });
});
