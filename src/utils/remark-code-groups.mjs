import { visit } from "unist-util-visit";

export function remarkCodeGroups() {
  return (tree) => {
    const nodesToReplace = [];

    // Find all paragraph nodes that contain ::: code-group
    visit(tree, (node, index, parent) => {
      if (node.type === "paragraph" && parent && typeof index === "number") {
        const text = node.children?.map((child) => child.value || "").join("");

        if (text.trim() === "::: code-group") {
          // Found start of code group, now collect all nodes until :::
          const startIndex = index;
          let endIndex = -1;
          const contentNodes = [];

          // Look ahead for the closing :::
          for (let j = index + 1; j < parent.children.length; j++) {
            const nextNode = parent.children[j];

            if (nextNode.type === "paragraph") {
              const nextText = nextNode.children
                ?.map((child) => child.value || "")
                .join("");
              if (nextText.trim() === ":::") {
                endIndex = j;
                break;
              }
            }

            contentNodes.push(nextNode);
          }

          if (endIndex !== -1) {
            // Found a complete code group, collect code blocks
            const codeBlocks = contentNodes.filter(
              (node) => node.type === "code",
            );

            if (codeBlocks.length > 0) {
              // Language to icon mapping
              const languageIcons = {
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
                  languageIcons[language.toLowerCase()] ||
                  languageIcons.default;

                // Remove the label from meta to avoid conflicts
                if (metaMatch) {
                  block.meta = block.meta
                    .replace(/\s*\[[^\]]+\]\s*/, " ")
                    .trim();
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

              // Add import statements if they don't exist
              const hasCodeGroupImport = tree.children.some(
                (child) =>
                  child.type === "mdxjsEsm" &&
                  child.value?.includes("CodeGroup") &&
                  child.value?.includes("../../components/CodeGroup.astro"),
              );
              const hasCodeGroupPanelImport = tree.children.some(
                (child) =>
                  child.type === "mdxjsEsm" &&
                  child.value?.includes("CodeGroupPanel") &&
                  child.value?.includes(
                    "../../components/CodeGroupPanel.astro",
                  ),
              );

              if (!hasCodeGroupImport) {
                tree.children.unshift({
                  type: "mdxjsEsm",
                  value:
                    'import CodeGroup from "../../components/CodeGroup.astro";',
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
                });
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
                });
              }

              // Mark nodes for replacement
              nodesToReplace.push({
                parent,
                startIndex,
                endIndex,
                replacement: codeGroup,
              });
            }
          }
        }
      }
    });

    // Apply replacements in reverse order to avoid index issues
    nodesToReplace
      .reverse()
      .forEach(({ parent, startIndex, endIndex, replacement }) => {
        parent.children.splice(
          startIndex,
          endIndex - startIndex + 1,
          replacement,
        );
      });
  };
}
