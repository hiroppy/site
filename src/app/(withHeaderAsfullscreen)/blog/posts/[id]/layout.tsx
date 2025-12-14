import "./_styles/blog.css";

export default function BlogLayout({
  children,
}: LayoutProps<"/blog/posts/[id]">) {
  return <div className="font-blog-family">{children}</div>;
}
