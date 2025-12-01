import { Icon } from "./Icon";
import { Link } from "./Link";
import meta from "../../node_modules/hiroppy/generated/meta.json";

export function Footer() {
  return (
    <footer className="mt-12 h-20 border-t border-t-gray-200">
      <div className="container mx-auto flex h-full items-center justify-between text-sm text-gray-600">
        <span data-testid="copyright-year">
          © {new Date().getFullYear()} - Copyright Hiroppy, All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <Link href={meta.sns.github} ariaLabel="GitHub">
            <Icon icon="mdi:github" width="20" height="20" />
          </Link>
          <Link href={meta.sns.twitter} ariaLabel="Twitter">
            <Icon icon="mdi:twitter" width="20" height="20" />
          </Link>
          <Link href={meta.sns.linkedin} ariaLabel="LinkedIn">
            <Icon icon="mdi:linkedin" width="20" height="20" />
          </Link>
          <Link href="/blog/rss.xml" ariaLabel="RSS">
            <Icon icon="mdi:rss" width="20" height="20" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
