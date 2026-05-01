import type { Root, RootContent } from "mdast";

export function buildEsmImport(
  componentName: string,
  importPath: string,
): RootContent {
  return {
    type: "mdxjsEsm",
    value: `import { ${componentName} } from "${importPath}";`,
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
        sourceType: "module",
      },
    },
  } as unknown as RootContent;
}

export function hasComponentImport(
  tree: Root,
  componentName: string,
  importPath: string,
): boolean {
  return tree.children.some(
    (child) =>
      "value" in child &&
      typeof child.value === "string" &&
      child.value.includes(componentName) &&
      child.value.includes(importPath),
  );
}

export function ensureComponentImport(
  tree: Root,
  componentName: string,
  importPath: string,
): void {
  if (hasComponentImport(tree, componentName, importPath)) return;
  tree.children.unshift(buildEsmImport(componentName, importPath));
}
