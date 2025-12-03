import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkAlerts } from "./src/mdx/remark/remarkAlerts";
import { remarkCodeGroups } from "./src/mdx/remark/remarkCodeGroups";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  typedRoutes: true,
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400", // 31 days
          },
        ],
      },
      {
        source: "/labs/feedle/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=3600", // 5 min cache, 1hr stale
          },
        ],
      },
    ];
  },
  experimental: {
    // turbopack + mdxRsはcustom pluginsをサポートしていない
    mdxRs: false,
    typedEnv: true,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      remarkCodeGroups,
      remarkAlerts,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeExpressiveCode,
        {
          themes: ["nord"],
          styleOverrides: {
            borderRadius: "0.375rem",
            borderColor: "rgb(84 88 100)",
          },
          defaultProps: {
            overridesByLang: {
              "bash,sh,shell": {
                frame: "none",
              },
            },
          },
          plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
