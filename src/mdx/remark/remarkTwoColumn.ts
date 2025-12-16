import type { Paragraph, Root, RootContent } from "mdast";
import type { Gap, Ratio } from "../components/TwoColumn";

const VALID_RATIOS: Ratio[] = ["1:1", "1:2", "2:1", "3:2", "2:3"];
const VALID_GAPS: Gap[] = ["sm", "md", "lg"];

type ColumnBlock = {
  startIndex: number;
  endIndex: number;
  contentNodes: RootContent[];
  ratio: Ratio;
  gap: Gap;
};

function parseColumnOptions(text: string): { ratio: Ratio; gap: Gap } {
  // Extract text after "::: columns"
  const textContent = text.trim().replace(/^::: columns\s*/, "");
  const parts = textContent.trim().split(/\s+/).filter(Boolean);

  // Parse ratio (first argument)
  const ratioCandidate = parts[0] || "";
  const ratio = VALID_RATIOS.includes(ratioCandidate as Ratio)
    ? (ratioCandidate as Ratio)
    : "1:1";

  // Parse gap (second argument)
  const gapCandidate = parts[1] || "";
  const gap = VALID_GAPS.includes(gapCandidate as Gap)
    ? (gapCandidate as Gap)
    : "md";

  return { ratio, gap };
}

function splitByThematicBreak(nodes: RootContent[]): {
  leftColumn: RootContent[];
  rightColumn: RootContent[];
} {
  // Find the first thematicBreak
  const separatorIndex = nodes.findIndex(
    (node) => node.type === "thematicBreak",
  );

  if (separatorIndex === -1) {
    // No separator found - all content goes to left column
    return { leftColumn: nodes, rightColumn: [] };
  }

  // Split at the first separator
  return {
    leftColumn: nodes.slice(0, separatorIndex),
    rightColumn: nodes.slice(separatorIndex + 1),
  };
}

function createColumnDiv(columnNodes: RootContent[]) {
  return {
    type: "mdxJsxFlowElement",
    name: "div",
    attributes: [],
    children: columnNodes,
  };
}

export function remarkTwoColumn() {
  return (tree: Root) => {
    const columnBlocks: ColumnBlock[] = [];
    let processedBlocks = 0;

    // First pass: find all columns blocks without modifying the tree
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === "paragraph") {
        const paragraphNode = node as Paragraph;
        const text = paragraphNode.children
          ?.map((child) => ("value" in child ? child.value : ""))
          .join("");

        // Check if it's a columns block
        if (text.trim().startsWith("::: columns")) {
          // Parse ratio and gap options
          const { ratio, gap } = parseColumnOptions(text);

          // Found start of columns block, now find the end
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
            columnBlocks.push({
              startIndex: i,
              endIndex: endIndex,
              contentNodes: contentNodes,
              ratio,
              gap,
            });

            // Skip to after this columns block to avoid nested processing
            i = endIndex;
          }
        }
      }
    }

    // Second pass: process columns blocks in reverse order
    for (
      let blockIndex = columnBlocks.length - 1;
      blockIndex >= 0;
      blockIndex--
    ) {
      const { startIndex, endIndex, contentNodes, ratio, gap } =
        columnBlocks[blockIndex];

      // Split content at thematicBreak
      const { leftColumn, rightColumn } = splitByThematicBreak(contentNodes);

      // Create column divs
      const leftColumnDiv = createColumnDiv(leftColumn);
      const rightColumnDiv = createColumnDiv(rightColumn);

      // Build attributes array
      const attributes = [
        {
          type: "mdxJsxAttribute",
          name: "ratio",
          value: ratio,
        },
        {
          type: "mdxJsxAttribute",
          name: "gap",
          value: gap,
        },
      ];

      // Create TwoColumn component
      const twoColumnComponent = {
        type: "mdxJsxFlowElement",
        name: "TwoColumn",
        attributes: attributes,
        children: [leftColumnDiv, rightColumnDiv],
      };

      // Replace the entire columns block range with the new component
      tree.children.splice(
        startIndex,
        endIndex - startIndex + 1,
        twoColumnComponent as unknown as RootContent,
      );

      processedBlocks++;
    }

    // Add import statement if any columns blocks were processed
    if (processedBlocks > 0) {
      const hasTwoColumnImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes("TwoColumn") &&
          child.value.includes("../../mdx/components/TwoColumn"),
      );

      if (!hasTwoColumnImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import { TwoColumn } from "../../mdx/components/TwoColumn";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportSpecifier",
                      imported: { type: "Identifier", name: "TwoColumn" },
                      local: { type: "Identifier", name: "TwoColumn" },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../mdx/components/TwoColumn",
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
