export type Frontmatter = {
  title: string;
  description: string;
  date: Date;
  image: string;
  tags: string;
  hatenaPath?: string;
  references?: string[];
};

export type HeadingData = {
  depth: number;
  slug: string;
  text: string;
};

export type BlogPost = {
  id: string;
  frontmatter: Frontmatter;
  MDXContent: React.ComponentType;
  headings: HeadingData[];
};

export type BlogPostPreview = Omit<BlogPost, "MDXContent" | "headings">;
