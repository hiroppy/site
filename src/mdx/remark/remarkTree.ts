import type { List, ListItem, Paragraph, Root, RootContent } from "mdast";
import { ensureComponentImport } from "./_utils";

type DirectoryTreeItem = {
  children?: DirectoryTreeItem[];
  id: string;
  label: string;
};

type TreeBlock = {
  contentNodes: RootContent[];
  endIndex: number;
  startIndex: number;
};

const DIRECTORY_TREE_IMPORT_PATH = "../../mdx/components/DirectoryTree";

function paragraphText(node: RootContent): string | undefined {
  if (node.type !== "paragraph") return undefined;

  const paragraph = node as Paragraph;
  return paragraph.children
    ?.map((child) => ("value" in child ? child.value : ""))
    .join("")
    .trim();
}

function sanitizeLabel(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "node"
  );
}

function extractText(node: RootContent): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  if ("children" in node && Array.isArray(node.children)) {
    return node.children
      .map((child) => extractText(child as RootContent))
      .join("");
  }

  return "";
}

function buildTreeItems(
  nodes: RootContent[],
  parentId?: string,
): DirectoryTreeItem[] {
  const lists = nodes.filter((node) => node.type === "list") as List[];
  return lists.flatMap((list) =>
    list.children.map((item, index) =>
      buildTreeItem(item, parentId, index, ""),
    ),
  );
}

function buildTreeItem(
  listItem: ListItem,
  parentId: string | undefined,
  index: number,
  pathLabel: string,
): DirectoryTreeItem {
  const labelPortion = listItem.children.filter(
    (child) => child.type !== "list",
  );
  const label = labelPortion
    .map((child) => extractText(child))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const sanitized = sanitizeLabel(label || pathLabel || "node");
  const prefix = parentId ? `${parentId}-` : "";
  const id = `${prefix}${sanitized}-${index}`;

  const nestedLists = listItem.children.filter(
    (child) => child.type === "list",
  ) as List[];

  const children = nestedLists.flatMap((list) =>
    list.children.map((child, childIndex) =>
      buildTreeItem(child, id, childIndex, label),
    ),
  );

  return {
    children: children.length ? children : undefined,
    id,
    label: label || "Untitled",
  };
}

export function remarkTree() {
  return (tree: Root) => {
    const treeBlocks: TreeBlock[] = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      const text = paragraphText(node);

      if (!text?.startsWith("::: tree")) continue;

      const contentNodes: RootContent[] = [];
      let endIndex = -1;

      for (let j = i + 1; j < tree.children.length; j++) {
        const nextNode = tree.children[j];
        const nextText = paragraphText(nextNode);
        if (nextText === ":::") {
          endIndex = j;
          break;
        }
        contentNodes.push(nextNode);
      }

      if (endIndex === -1) continue;

      treeBlocks.push({
        contentNodes,
        endIndex,
        startIndex: i,
      });

      i = endIndex;
    }

    let processed = 0;

    for (
      let blockIndex = treeBlocks.length - 1;
      blockIndex >= 0;
      blockIndex--
    ) {
      const { contentNodes, endIndex, startIndex } = treeBlocks[blockIndex];
      const items = buildTreeItems(contentNodes);
      if (items.length === 0) continue;

      const treeComponent = {
        type: "mdxJsxFlowElement",
        name: "DirectoryTree",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "items",
            value: JSON.stringify(items),
          },
        ],
        children: [],
      } as unknown as RootContent;

      tree.children.splice(
        startIndex,
        endIndex - startIndex + 1,
        treeComponent,
      );

      processed++;
    }

    if (processed === 0) return;

    ensureComponentImport(tree, "DirectoryTree", DIRECTORY_TREE_IMPORT_PATH);
  };
}
