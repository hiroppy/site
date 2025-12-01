import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Sidebar } from "./_components/Sidebar";

export default async function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header className="mobile-header lg:hidden" />
      <div className="mx-auto flex min-h-screen max-w-[1000px] flex-col px-6 py-10 lg:flex-row lg:gap-20 lg:pt-20">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex grow flex-col max-w-[600px] m-auto w-full">
          <div className="grow">{children}</div>
          <Footer className="mt-20" />
        </main>
      </div>
    </>
  );
}
