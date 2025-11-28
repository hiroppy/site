import type { Root, RootContent, Code, Paragraph } from "mdast";

interface CodeGroup {
  startIndex: number;
  endIndex: number;
  contentNodes: RootContent[];
}

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
        // Language to icon mapping
        const languageIcons: Record<string, string> = {
          javascript: "mdi:language-javascript",
          js: "mdi:language-javascript",
          typescript: "mdi:language-typescript",
          ts: "mdi:language-typescript",
          python: "mdi:language-python",
          py: "mdi:language-python",
          java: "mdi:language-java",
          cpp: "mdi:language-cpp",
          c: "mdi:language-c",
          csharp: "mdi:language-csharp",
          php: "mdi:language-php",
          go: "mdi:language-go",
          rust: "mdi:language-rust",
          ruby: "mdi:language-ruby",
          swift: "mdi:language-swift",
          kotlin: "mdi:language-kotlin",
          html: "mdi:language-html5",
          css: "mdi:language-css3",
          scss: "mdi:sass",
          sass: "mdi:sass",
          bash: "mdi:console",
          shell: "mdi:console",
          sh: "mdi:console",
          zsh: "mdi:console",
          powershell: "mdi:powershell",
          json: "mdi:code-json",
          yaml: "mdi:file-code",
          yml: "mdi:file-code",
          xml: "mdi:xml",
          markdown: "mdi:language-markdown",
          md: "mdi:language-markdown",
          sql: "mdi:database",
          graphql: "mdi:graphql",
          vue: "mdi:vuejs",
          react: "mdi:react",
          angular: "mdi:angular",
          svelte: "mdi:svelte",
          npm: "mdi:npm",
          yarn: "mdi:yarn",
          pnpm: "mdi:package-variant",
          docker: "mdi:docker",
          git: "mdi:git",
          github: "mdi:github",
          node: "mdi:nodejs",
          nodejs: "mdi:nodejs",
          default: "mdi:code-braces",
        };

        // Create panels from code blocks
        const panels = codeBlocks.map((block, i) => {
          // Extract label from meta (e.g., ```bash [npm])
          const metaMatch = block.meta?.match(/\[([^\]]+)\]/);
          const label = metaMatch ? metaMatch[1] : `Tab ${i + 1}`;

          // Get language and corresponding icon
          const language = block.lang || "default";
          const iconName =
            languageIcons[language.toLowerCase()] || languageIcons.default;

          // Remove the label from meta to avoid conflicts
          if (metaMatch && block.meta) {
            block.meta = block.meta.replace(/\s*\[[^\]]+\]\s*/, " ").trim();
          }

          return {
            type: "mdxJsxFlowElement",
            name: "CodeGroupPanel",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "label",
                value: label,
              },
              {
                type: "mdxJsxAttribute",
                name: "icon",
                value: iconName,
              },
              {
                type: "mdxJsxAttribute",
                name: "language",
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
          child.value.includes("../../components/CodeGroup.astro"),
      );
      const hasCodeGroupPanelImport = tree.children.some(
        (child) =>
          "value" in child &&
          typeof child.value === "string" &&
          child.value.includes("CodeGroupPanel") &&
          child.value.includes("../../components/CodeGroupPanel.astro"),
      );

      if (!hasCodeGroupImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value: 'import CodeGroup from "../../components/CodeGroup.astro";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: { type: "Identifier", name: "CodeGroup" },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../components/CodeGroup.astro",
                  },
                },
              ],
            },
          },
        } as unknown as RootContent);
      }
      if (!hasCodeGroupPanelImport) {
        tree.children.unshift({
          type: "mdxjsEsm",
          value:
            'import CodeGroupPanel from "../../components/CodeGroupPanel.astro";',
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: {
                        type: "Identifier",
                        name: "CodeGroupPanel",
                      },
                    },
                  ],
                  source: {
                    type: "Literal",
                    value: "../../components/CodeGroupPanel.astro",
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
