import styles from "../../../styles/blog.module.css";

export default function Layout({ children }: LayoutProps<"/blog">) {
  return <div className={styles.blogLayout}>{children}</div>;
}
