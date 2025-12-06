"use cache";

import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";

export default async function WithHeaderLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
