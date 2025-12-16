import type { Paragraph, Root, RootContent } from "mdast";

type DetailsGroup = {
  startIndex: number;
  endIndex: number;
  contentNodes: RootContent[];
  summary?: string;
};

export function remarkDetails() {
  return (tree: Root) => {
    const detailsGroups: DetailsGroup[] = [];
    let processedGroups = 0;

    // First pass: find all details blocks without modifying the tree
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === "paragraph") {
        const paragraphNode = node as Paragraph;
        const text = paragraphNode.children
          ?.map((child) => ("value" in child ? child.value : ""))
          .join("");

        // Check if it's a details block
        if (text.trim().startsWith("::: details")) {
          // Extract custom summary
          const textContent = text.trim().replace(/^::: details\s*/, "");
          const customSummary = textContent.trim() || undefined;

          // Found start of details block, now find the end
          let endIndex = -1;
          const contentNodes: RootContent[] = [];

          // Look ahead for the closing :::
          for (let j = i + 1; j < tree.children.length; j++) {
            const nextNode = tree.children[j];

            if (nextNode.type === "paragraph") {
              const nextParagraph = nextNode as Paragraph;
              const nextText = nextParagraph.children
                ?.map((child) => ("value" in child ? child.value : ""))
                .join("");
              if (nextText.trim() === ":::") {
                endIndex = j;
                break;
              }
            }

            contentNodes.push(nextNode);
          }

          if (endIndex !== -1) {
            detailsGroups.push({
              startIndex: i,
              endIndex: endIndex,
              contentNodes: contentNodes,
              summary: customSummary,
            });

            // Skip to after this details block to avoid nested processing
            i = endIndex;
          }
        }
      }
    }

    // Second pass: process details groups in reverse order
    for (
      let groupIndex = detailsGroups.length - 1;
      groupIndex >= 0;
      groupIndex--
    ) {
      const { startIndex, endIndex, contentNodes, summary } =
        detailsGroups[groupIndex];

      // Build attributes array
      const attributes = [];

      if (summary) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "summary",
          value: summary,
        });
      }

      // Create Details component
      const detailsComponent = {
        type: "mdxJsxFlowElement",
        name: "Details",
        attributes: attributes,
        children: contentNodes,
      };

      // Replace the entire details block range with the new component
      tree.children.splice(
        startIndex,
        endIndex - startIndex + 1,
        detailsComponent as unknown as RootContent,
      );

      processedGroups++;
    }

    // Add import statement if any details blocks were processed
    if (processedGroups > 0) {
      const hasDetailsImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes("Details") &&
          child.value.includes("../../mdx/components/Details"),
      );

      if (!hasDetailsImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import { Details } from "../../mdx/components/Details";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportSpecifier",
                      imported: { type: "Identifier", name: "Details" },
                      local: { type: "Identifier", name: "Details" },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../mdx/components/Details",
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
