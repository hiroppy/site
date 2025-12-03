import { Header } from "../_components/Header";

export default function FullscreenLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="fullscreen" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
