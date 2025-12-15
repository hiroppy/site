"use cache";

import meta from "hiroppy/generated/meta.json";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdRssFeed } from "react-icons/md";
import { SITE_REPOSITORY_URL } from "../constants";
import { cn } from "../utils/cn";
import { Link } from "./Link";

type Props = {
  className?: string;
};

export async function Footer({ className }: Props) {
  return (
    <footer className={cn("h-20 border-t border-t-gray-200", className)}>
      <div className="container mx-auto flex h-full items-center justify-between text-sm text-gray-600">
        <span data-testid="copyright-year">
          © {new Date().getFullYear()} - Copyright Hiroppy, All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <Link href={SITE_REPOSITORY_URL} ariaLabel="GitHub">
            <FaGithub size={20} aria-hidden="true" focusable="false" />
          </Link>
          <Link href={meta.sns.twitter} ariaLabel="Twitter">
            <FaXTwitter size={20} aria-hidden="true" focusable="false" />
          </Link>
          <Link href={meta.sns.linkedin} ariaLabel="LinkedIn">
            <FaLinkedin size={20} aria-hidden="true" focusable="false" />
          </Link>
          <Link href="/blog/rss.xml" ariaLabel="RSS">
            <MdRssFeed size={20} aria-hidden="true" focusable="false" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
