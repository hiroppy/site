import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { Sidebar } from "../_components/Sidebar";

export default function WithSidebarLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="mobile-header md:hidden">
        <Header />
      </div>
      <div className="mx-auto flex min-h-screen max-w-[1000px] flex-col px-6 py-10 md:flex-row md:gap-20 md:pt-20">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex grow flex-col" style={{ maxWidth: "600px" }}>
          <div className="grow">{children}</div>
          <Footer />
        </main>
      </div>
    </>
  );
}
