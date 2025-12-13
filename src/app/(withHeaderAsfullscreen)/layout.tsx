import { Suspense } from "react";
import { Header } from "../../components/Header";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-(--header-height)" />}>
        <Header variant="fullscreen" />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
}
