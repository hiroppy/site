import { Link } from "../components/Link";
import { createMetadata } from "../utils/metadata";

export const metadata = createMetadata({
  path: "/not-found",
  title: "404",
  description: "Page not found",
});

export default function NotFound() {
  return (
    <div className="bg-bg relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="relative z-10 flex flex-col items-center space-y-10 text-center">
        <h1 className="text-text-main text-4xl font-bold md:text-5xl">
          404 - Page Not Found
        </h1>
        <div>
          <Link href="/" variant="button" className="px-10">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
