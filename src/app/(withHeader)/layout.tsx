import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default async function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
