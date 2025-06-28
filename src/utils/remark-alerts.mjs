import { visit } from "unist-util-visit";

export function remarkAlerts() {
  return (tree) => {
    const nodesToReplace = [];

    visit(tree, "blockquote", (node, index, parent) => {
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0];
      if (firstChild.type !== "paragraph" || !firstChild.children) return;

      const firstTextNode = firstChild.children[0];
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
        firstChild.children.shift();
      }

      // If the first paragraph is now empty, remove it
      if (firstChild.children.length === 0) {
        node.children.shift();
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
        children: node.children,
      };

      nodesToReplace.push({
        parent,
        index,
        replacement: alertComponent,
      });
    });

    // Apply replacements
    nodesToReplace.reverse().forEach(({ parent, index, replacement }) => {
      parent.children[index] = replacement;
    });

    // Add import statement if any alerts were found
    if (nodesToReplace.length > 0) {
      const hasAlertImport = tree.children.some(
        (child) =>
          child.type === "mdxjsEsm" &&
          child.value?.includes("Alert") &&
          child.value?.includes("../../components/Alert.astro"),
      );

      if (!hasAlertImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import Alert from "../../components/Alert.astro";',
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
                    value: "../../components/Alert.astro",
                  },
                },
              ],
            },
          },
        });
      }
    }
  };
}
