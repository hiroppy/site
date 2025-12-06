import type { ReactNode } from "react";
import "../_styles/two-pane-layout.css";
import { cn } from "../_utils/cn";
import { Footer } from "./Footer";

type Props = {
  className?: string;
  sidebar: ReactNode;
  content: ReactNode;
};

export function TwoPaneLayout({ className, sidebar, content }: Props) {
  return (
    <div className={cn("flex w-full flex-col md:flex-row", className)}>
      <div className="sidebar-container">{sidebar}</div>

      <div className="main-content bg-bg flex flex-1 flex-col overflow-x-hidden">
        {content}
        <div className="mx-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}
