import type { Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkOgLinks } from "./remarkOgLinks";

const runPlugin = (tree: Root) => {
  remarkOgLinks()(tree);
  return tree;
};

const isMdxImport = (node: RootContent) => (node as any).type === "mdxjsEsm";

describe("remarkOgLinks", () => {
  it("replaces standalone link paragraphs with OG components and injects the import", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://example.com",
              title: null,
              children: [{ type: "text", value: "Example Site" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const ogNode = result.children.find(
      (child) => (child as any).name === "OG",
    ) as any;
    expect(ogNode).toBeDefined();
    expect(ogNode.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "url", value: "https://example.com" },
    ]);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);
    expect((mdxImports[0] as any).value).toContain(
      'import { OG } from "../../mdx/components/OG";',
    );
  });

  it("leaves paragraphs with surrounding text untouched", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Check this " },
            {
              type: "link",
              url: "https://example.com",
              title: null,
              children: [{ type: "text", value: "Example Site" }],
            },
            { type: "text", value: " for details" },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    expect(result.children.some((child) => (child as any).name === "OG")).toBe(
      false,
    );
    expect(result.children.some(isMdxImport)).toBe(false);
  });

  it("does not duplicate imports when one is already present and handles multiple links", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "mdxjsEsm",
          value: 'import { OG } from "../../mdx/components/OG";',
        } as any,
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://first.example",
              title: null,
              children: [{ type: "text", value: "First" }],
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://second.example",
              title: null,
              children: [{ type: "text", value: "Second" }],
            },
          ],
        },
      ] as any[],
    };

    const result = runPlugin(tree);

    const mdxImports = result.children.filter(isMdxImport);
    expect(mdxImports).toHaveLength(1);

    const ogNodes = result.children.filter(
      (child) => (child as any).name === "OG",
    ) as any[];
    expect(ogNodes).toHaveLength(2);
    expect(ogNodes[0].attributes?.[0]?.value).toBe("https://first.example");
    expect(ogNodes[1].attributes?.[0]?.value).toBe("https://second.example");
  });

  describe("YouTube links", () => {
    it("transforms youtube.com/watch URLs to YoutubeCard", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const youtubeNode = result.children.find(
        (child) => (child as any).name === "YoutubeCard",
      ) as any;
      expect(youtubeNode).toBeDefined();
      expect(youtubeNode.attributes).toEqual([
        { type: "mdxJsxAttribute", name: "id", value: "dQw4w9WgXcQ" },
      ]);

      const mdxImports = result.children.filter(isMdxImport);
      expect(mdxImports).toHaveLength(1);
      expect((mdxImports[0] as any).value).toContain(
        'import { YoutubeCard } from "../../mdx/components/YoutubeCard";',
      );
    });

    it("transforms youtu.be URLs to YoutubeCard", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://youtu.be/dQw4w9WgXcQ",
                title: null,
                children: [
                  { type: "text", value: "https://youtu.be/dQw4w9WgXcQ" },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const youtubeNode = result.children.find(
        (child) => (child as any).name === "YoutubeCard",
      ) as any;
      expect(youtubeNode).toBeDefined();
      expect(youtubeNode.attributes).toEqual([
        { type: "mdxJsxAttribute", name: "id", value: "dQw4w9WgXcQ" },
      ]);
    });

    it("transforms youtube.com/embed URLs to YoutubeCard", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const youtubeNode = result.children.find(
        (child) => (child as any).name === "YoutubeCard",
      ) as any;
      expect(youtubeNode).toBeDefined();
      expect(youtubeNode.attributes[0].value).toBe("dQw4w9WgXcQ");
    });

    it("handles YouTube URLs with query parameters", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be",
                title: null,
                children: [
                  {
                    type: "text",
                    value:
                      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be",
                  },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const youtubeNode = result.children.find(
        (child) => (child as any).name === "YoutubeCard",
      ) as any;
      expect(youtubeNode).toBeDefined();
      expect(youtubeNode.attributes[0].value).toBe("dQw4w9WgXcQ");
    });

    it("falls back to OG for invalid YouTube URLs", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/invalid",
                title: null,
                children: [
                  { type: "text", value: "https://www.youtube.com/invalid" },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const ogNode = result.children.find(
        (child) => (child as any).name === "OG",
      ) as any;
      expect(ogNode).toBeDefined();
      expect(
        result.children.find((child) => (child as any).name === "YoutubeCard"),
      ).toBeUndefined();
    });
  });

  describe("Twitter/X links", () => {
    it("transforms twitter.com status URLs to TwitterCard", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://twitter.com/jack/status/20",
                title: null,
                children: [
                  { type: "text", value: "https://twitter.com/jack/status/20" },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const twitterNode = result.children.find(
        (child) => (child as any).name === "TwitterCard",
      ) as any;
      expect(twitterNode).toBeDefined();
      expect(twitterNode.attributes).toEqual([
        { type: "mdxJsxAttribute", name: "id", value: "20" },
      ]);

      const mdxImports = result.children.filter(isMdxImport);
      expect(mdxImports).toHaveLength(1);
      expect((mdxImports[0] as any).value).toContain(
        'import { TwitterCard } from "../../mdx/components/TwitterCard";',
      );
    });

    it("transforms x.com status URLs to TwitterCard", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://x.com/jack/status/20",
                title: null,
                children: [
                  { type: "text", value: "https://x.com/jack/status/20" },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const twitterNode = result.children.find(
        (child) => (child as any).name === "TwitterCard",
      ) as any;
      expect(twitterNode).toBeDefined();
      expect(twitterNode.attributes[0].value).toBe("20");
    });

    it("handles Twitter URLs with query parameters", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://twitter.com/user/status/1234567890?s=20",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://twitter.com/user/status/1234567890?s=20",
                  },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const twitterNode = result.children.find(
        (child) => (child as any).name === "TwitterCard",
      ) as any;
      expect(twitterNode).toBeDefined();
      expect(twitterNode.attributes[0].value).toBe("1234567890");
    });

    it("falls back to OG for invalid Twitter URLs", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://twitter.com/jack",
                title: null,
                children: [{ type: "text", value: "https://twitter.com/jack" }],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const ogNode = result.children.find(
        (child) => (child as any).name === "OG",
      ) as any;
      expect(ogNode).toBeDefined();
      expect(
        result.children.find((child) => (child as any).name === "TwitterCard"),
      ).toBeUndefined();
    });
  });

  describe("Import management", () => {
    it("imports only used components without duplicates", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  },
                ],
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://twitter.com/jack/status/20",
                title: null,
                children: [
                  { type: "text", value: "https://twitter.com/jack/status/20" },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const mdxImports = result.children.filter(isMdxImport) as any[];
      expect(mdxImports).toHaveLength(2);

      const importValues = mdxImports.map((imp) => imp.value);
      expect(importValues).toContain(
        'import { YoutubeCard } from "../../mdx/components/YoutubeCard";',
      );
      expect(importValues).toContain(
        'import { TwitterCard } from "../../mdx/components/TwitterCard";',
      );
    });

    it("handles mixed specialized and OG links", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  },
                ],
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://example.com",
                title: null,
                children: [{ type: "text", value: "https://example.com" }],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const youtubeNode = result.children.find(
        (child) => (child as any).name === "YoutubeCard",
      );
      const ogNode = result.children.find(
        (child) => (child as any).name === "OG",
      );

      expect(youtubeNode).toBeDefined();
      expect(ogNode).toBeDefined();

      const mdxImports = result.children.filter(isMdxImport) as any[];
      expect(mdxImports).toHaveLength(2);

      const importValues = mdxImports.map((imp) => imp.value);
      expect(importValues).toContain(
        'import { YoutubeCard } from "../../mdx/components/YoutubeCard";',
      );
      expect(importValues).toContain(
        'import { OG } from "../../mdx/components/OG";',
      );
    });

    it("does not duplicate imports when already present", () => {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "mdxjsEsm",
            value:
              'import { YoutubeCard } from "../../mdx/components/YoutubeCard";',
          } as any,
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                title: null,
                children: [
                  {
                    type: "text",
                    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  },
                ],
              },
            ],
          },
        ] as any[],
      };

      const result = runPlugin(tree);

      const mdxImports = result.children.filter(isMdxImport);
      expect(mdxImports).toHaveLength(1);
    });
  });
});
