import type { Code, Paragraph, Root, RootContent } from "mdast";

const languageIcons = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  html: "html",
  css: "css",
  bash: "console",
  shell: "console",
  sh: "console",
  zsh: "console",
  json: "json",
  yaml: "file-code",
  yml: "file-code",
  markdown: "markdown",
  md: "markdown",
  graphql: "graphql",
  docker: "docker",
  git: "git",
  default: "file-code",
} as const;

type LanguageIconsKeys = keyof typeof languageIcons;
export type LanguageIconValues = (typeof languageIcons)[LanguageIconsKeys];

type CodeGroup = {
  startIndex: number;
  endIndex: number;
  contentNodes: RootContent[];
};

export function remarkCodeGroups() {
  return (tree: Root) => {
    // Collect all code groups in a separate pass first
    const codeGroups: CodeGroup[] = [];
    let processedGroups = 0;

    // First pass: find all code groups without modifying the tree
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === "paragraph") {
        const paragraphNode = node as Paragraph;
        const text = paragraphNode.children
          ?.map((child) => ("value" in child ? child.value : ""))
          .join("");

        if (text.trim() === "::: code-group") {
          // Found start of code group, now find the end
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
            codeGroups.push({
              startIndex: i,
              endIndex: endIndex,
              contentNodes: contentNodes,
            });

            // Skip to after this code group to avoid nested processing
            i = endIndex;
          }
        }
      }
    }

    // Second pass: process code groups in reverse order
    for (
      let groupIndex = codeGroups.length - 1;
      groupIndex >= 0;
      groupIndex--
    ) {
      const { startIndex, endIndex, contentNodes } = codeGroups[groupIndex];

      // Filter only code blocks
      const codeBlocks = contentNodes.filter(
        (node): node is Code => node.type === "code",
      );

      if (codeBlocks.length > 0) {
        // Create panels from code blocks
        const panels = codeBlocks.map((block, i) => {
          // Extract label from meta (e.g., ```bash [npm])
          const metaMatch = block.meta?.match(/\[([^\]]+)\]/);
          const label = metaMatch ? metaMatch[1] : `Tab ${i + 1}`;

          // Get language and corresponding icon
          const language = block.lang || "default";
          const iconName =
            languageIcons[language.toLowerCase() as LanguageIconsKeys] ||
            languageIcons.default;

          // Remove the label from meta to avoid conflicts
          if (metaMatch && block.meta) {
            block.meta = block.meta.replace(/\s*\[[^\]]+\]\s*/, " ").trim();
          }

          return {
            type: "mdxJsxFlowElement",
            name: "div",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "className",
                value: "code-group-panel",
              },
              {
                type: "mdxJsxAttribute",
                name: "data-label",
                value: label,
              },
              {
                type: "mdxJsxAttribute",
                name: "data-icon",
                value: iconName,
              },
              {
                type: "mdxJsxAttribute",
                name: "data-language",
                value: language,
              },
            ],
            children: [block],
          };
        });

        // Create CodeGroup component
        const codeGroup = {
          type: "mdxJsxFlowElement",
          name: "CodeGroup",
          attributes: [],
          children: panels,
        };

        // Replace the entire code group range with the new component
        tree.children.splice(
          startIndex,
          endIndex - startIndex + 1,
          codeGroup as unknown as RootContent,
        );

        processedGroups++;
      }
    }

    // Add import statements if any code groups were processed
    if (processedGroups > 0) {
      const hasCodeGroupImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes("CodeGroup") &&
          child.value.includes("../../mdx/components/CodeGroup"),
      );

      if (!hasCodeGroupImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import { CodeGroup } from "../../mdx/components/CodeGroup";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportSpecifier",
                      imported: { type: "Identifier", name: "CodeGroup" },
                      local: { type: "Identifier", name: "CodeGroup" },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../mdx/components/CodeGroup",
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
