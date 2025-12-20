import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { remarkAlerts } from "./src/mdx/remark/remarkAlerts";
import { remarkCodeGroups } from "./src/mdx/remark/remarkCodeGroups";
import { remarkDetails } from "./src/mdx/remark/remarkDetails";
import { remarkExtractHeadings } from "./src/mdx/remark/remarkExtractHeadings";
import { remarkOgLinks } from "./src/mdx/remark/remarkOgLinks";
import { remarkTree } from "./src/mdx/remark/remarkTree";
import { remarkTwoColumn } from "./src/mdx/remark/remarkTwoColumn";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  typedRoutes: true,
  reactCompiler: true,
  reactStrictMode: true,
  cacheComponents: true,
  cacheLife: {
    default: {
      // state = 5 mins (default)
      revalidate: 60 * 60 * 24 * 7, // 1 week
      // expire = 1 year (default)
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
        source: "/(.*?)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400, immutable", // 31 days
          },
        ],
      },
    ];
  },
  experimental: {
    // turbopack + mdxRsはcustom pluginsをサポートしていない
    mdxRs: false,
    typedEnv: true,
    optimizePackageImports: ["hiroppy"],
  },
  serverExternalPackages: ["cheerio"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "frontmatter" }],
      remarkExtractHeadings,
      remarkGfm,
      remarkCodeGroups,
      remarkAlerts,
      remarkDetails,
      remarkOgLinks,
      remarkTwoColumn,
      remarkTree,
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
