import { Suspense } from "react";
import { Footer } from "../../../../../components/Footer";
import { cn } from "../../../../../utils/cn";
import {
  ContentSkeleton,
  SidebarSkeleton,
} from "../_components/LoadingSkeletons";
import { Sidebar } from "../_components/Sidebar/Sidebar";
import styles from "../_styles/feedle-layout.module.css";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/labs/feedle/[type]">) {
  return (
    <div
      className={cn(
        "font-blog-family flex w-full flex-col md:flex-row",
        styles.feedleLayout,
      )}
    >
      <div className={cn("w-64 shrink-0", styles.sidebarContainer)}>
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar params={params} />
        </Suspense>
      </div>
      <div
        className={cn(
          "bg-bg flex flex-1 flex-col overflow-x-hidden",
          styles.mainContent,
        )}
      >
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<ContentSkeleton />}>{children}</Suspense>
        </div>
        <Footer className="mx-4 shrink-0" />
      </div>
    </div>
  );
}
