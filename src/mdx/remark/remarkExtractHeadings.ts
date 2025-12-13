import { slug as slugger } from "github-slugger";
import type { Heading, Root, RootContent, Text } from "mdast";
import type { HeadingData } from "../types";

export function remarkExtractHeadings() {
  return (tree: Root) => {
    const headings: HeadingData[] = [];

    // Extract all headings (h1-h3) from the markdown AST
    for (const node of tree.children) {
      if (node.type === "heading" && node.depth <= 3) {
        const headingNode = node as Heading;

        // Extract text from heading children
        const text = headingNode.children
          .map((child) => {
            if (child.type === "text") {
              return (child as Text).value;
            }
            // Handle other node types (e.g., links, emphasis)
            if ("children" in child) {
              return child.children
                .map((c) => ("value" in c ? String(c.value) : ""))
                .join("");
            }
            return "";
          })
          .join("");

        if (text) {
          headings.push({
            depth: headingNode.depth,
            slug: slugger(text),
            text,
          });
        }
      }
    }

    // Add export statement for headings (always export, even if empty)
    const headingsJson = JSON.stringify(headings);

    tree.children.unshift({
      type: "mdxjsEsm",
      value: `export const headings = ${headingsJson};`,
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExportNamedDeclaration",
              declaration: {
                type: "VariableDeclaration",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "headings" },
                    init: {
                      type: "Literal",
                      value: headingsJson,
                      raw: headingsJson,
                    },
                  },
                ],
                kind: "const",
              },
              specifiers: [],
              source: null,
            },
          ],
          sourceType: "module",
        },
      },
    } as unknown as RootContent);
  };
}
