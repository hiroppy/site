import styles from "../../../../../styles/blog.module.css";
import "./_styles/blog.css";

export default function BlogLayout({
  children,
}: LayoutProps<"/blog/posts/[id]">) {
  return <div className={styles.blogLayout}>{children}</div>;
}
