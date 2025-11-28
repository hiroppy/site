import type { Root, RootContent, Blockquote, Paragraph, Parent } from "mdast";
import { visit } from "unist-util-visit";

interface NodeReplacement {
  parent: Parent;
  index: number | undefined;
  replacement: RootContent;
}

export function remarkAlerts() {
  return (tree: Root) => {
    const nodesToReplace: NodeReplacement[] = [];

    visit(tree, "blockquote", (node, index, parent) => {
      const blockquote = node as Blockquote;
      if (!blockquote.children || blockquote.children.length === 0) return;

      const firstChild = blockquote.children[0];
      if (firstChild.type !== "paragraph") return;

      const paragraph = firstChild as Paragraph;
      if (!paragraph.children || paragraph.children.length === 0) return;

      const firstTextNode = paragraph.children[0];
      if (firstTextNode.type !== "text") return;

      // Check for GitHub-flavored alert syntax: [!TYPE]
      const alertMatch = firstTextNode.value.match(
        /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/,
      );
      if (!alertMatch) return;

      const alertType = alertMatch[1].toLowerCase();

      // Remove the alert marker from the first text node
      firstTextNode.value = firstTextNode.value.replace(
        /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/,
        "",
      );

      // If the first text node is now empty, remove it
      if (!firstTextNode.value.trim()) {
        paragraph.children.shift();
      }

      // If the first paragraph is now empty, remove it
      if (paragraph.children.length === 0) {
        blockquote.children.shift();
      }

      // Create Alert component
      const alertComponent = {
        type: "mdxJsxFlowElement",
        name: "Alert",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "type",
            value: alertType,
          },
        ],
        children: blockquote.children,
      };

      if (parent && index !== undefined) {
        nodesToReplace.push({
          parent,
          index,
          replacement: alertComponent as unknown as RootContent,
        });
      }
    });

    // Apply replacements
    nodesToReplace.reverse().forEach(({ parent, index, replacement }) => {
      if (
        "children" in parent &&
        Array.isArray(parent.children) &&
        index !== undefined
      ) {
        parent.children[index] = replacement;
      }
    });

    // Add import statement if any alerts were found
    if (nodesToReplace.length > 0) {
      const hasAlertImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes("Alert") &&
          child.value.includes("../../components/blog/Alert.astro"),
      );

      if (!hasAlertImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import Alert from "../../components/blog/Alert.astro";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: { type: "Identifier", name: "Alert" },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../components/blog/Alert.astro",
                  },
                },
              ],
            },
          },
        } as unknown as RootContent);
      }
    }
  };
}
