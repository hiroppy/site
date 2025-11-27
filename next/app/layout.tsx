import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import "./global.css";

export const metadata: Metadata = {
  title: "Hiroppy's site (Next preview)",
  description:
    "Preview build for migrating the site to Next.js static export. Production stays on Astro until migration completes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="with-view-transitions">
      <body className="font-body min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 text-slate-900 antialiased">
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
