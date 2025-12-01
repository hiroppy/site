declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";

  export const frontmatter: {
    title: string;
    description: string;
    date: string; // Note: exported as string, converted to Date in contentLoader
    image: string;
    tags: string;
    hatenaPath?: string;
    references?: string[];
  };

  export const headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;

  export default function MDXContent(props: MDXProps): JSX.Element;
}
