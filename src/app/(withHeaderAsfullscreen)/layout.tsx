"use cache";

import { Suspense } from "react";
import { Header } from "../_components/Header";

export default async function FullscreenLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: for feedle, should be removed */}
      <Suspense>
        <Header variant="fullscreen" />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
}
