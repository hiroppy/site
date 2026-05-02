import type { Root } from "mdast";
import { describe, expect, it } from "vitest";
import {
  findMdxComponents,
  findMdxEsmNodes,
  getMdxComponent,
  getStringAttr,
} from "./_testUtils";
import { remarkTree } from "./remarkTree";

const runPlugin = (tree: Root) => {
  remarkTree()(tree);
  return tree;
};

describe("remarkTree", () => {
  it("replaces tree block with DirectoryTree component and single import", () => {
    const nestedList = {
      type: "list",
      ordered: false,
      spread: false,
      children: [
        {
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: "bar" }],
            },
          ],
        },
      ],
    } as any;

    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: tree" }],
        },
        {
          type: "list",
          ordered: false,
          spread: false,
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "text", value: "foo" }],
                },
                nestedList,
              ],
            },
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "text", value: "baz" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ],
    };

    const result = runPlugin(tree);

    const importNodes = findMdxEsmNodes(result.children);
    expect(importNodes).toHaveLength(1);
    expect(importNodes[0].value).toContain(
      'import { DirectoryTree } from "../../mdx/components/DirectoryTree";',
    );

    const treeComponent = getMdxComponent(result.children, "DirectoryTree");
    const itemsValue = JSON.parse(getStringAttr(treeComponent, "items"));
    expect(itemsValue).toEqual([
      {
        id: "foo-0",
        label: "foo",
        children: [
          {
            id: "foo-0-bar-0",
            label: "bar",
          },
        ],
      },
      {
        id: "baz-1",
        label: "baz",
      },
    ]);
  });

  it("keeps tree block untouched when no list is provided", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: tree" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "nothing to show" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ],
    };

    const result = runPlugin(tree);

    expect(findMdxEsmNodes(result.children)).toHaveLength(0);
    expect(findMdxComponents(result.children, "DirectoryTree")).toHaveLength(0);
    expect(result.children[0].type).toBe("paragraph");
  });

  it("adds a single import for multiple tree blocks", () => {
    const makeList = (label: string) =>
      ({
        type: "list",
        ordered: false,
        spread: false,
        children: [
          {
            type: "listItem",
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", value: label }],
              },
            ],
          },
        ],
      }) as any;

    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: tree" }],
        },
        makeList("alpha"),
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "::: tree" }],
        },
        makeList("beta"),
        {
          type: "paragraph",
          children: [{ type: "text", value: ":::" }],
        },
      ],
    };

    const result = runPlugin(tree);

    const importNodes = findMdxEsmNodes(result.children);
    expect(importNodes).toHaveLength(1);
    expect(findMdxComponents(result.children, "DirectoryTree")).toHaveLength(2);
  });
});
