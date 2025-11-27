import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    mdxRs: true,
    externalDir: true,
  },
  pageExtensions: ["tsx", "ts", "mdx"],
  trailingSlash: true,
};

export default withMDX(nextConfig);
