"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { NavButton } from "./NavButton";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/media", label: "Media" },
  { href: "/jobs", label: "Jobs" },
  { href: "/blog", label: "Blog" },
  { href: "/labs", label: "Labs" },
];

const contactHref = "https://coder-penguin.com/#%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <Link href="/" aria-label="Hiroppy ホームページに戻る" className="inline-flex items-center space-x-3">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-blue-500 bg-white shadow-sm">
              <Image
                src="/images/cHVibGljL2NvbXBhbmllcy9jb2RlclBlbmd1aW4ucG5n.webp"
                alt="Hiroppy"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center space-x-2 md:flex" aria-label="メインナビゲーション">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname === `${item.href}/` || pathname?.startsWith(item.href + "/");
            return (
              <NavButton key={item.href} href={item.href} variant={active ? "active" : "default"}>
                {item.label}
              </NavButton>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button href={contactHref} variant="default" size="sm">
              <Icon icon="mdi:email-outline" className="mr-2" width={16} height={16} />
              お問い合わせ
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="sr-only">メニューを開く</span>
              <Icon icon="mdi:menu" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`md:hidden border-t border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-slate-900/90 transition ${isOpen ? "block" : "hidden"}`}
        aria-label="モバイルナビゲーション"
      >
        <div className="px-3 pt-5 pb-3">
          <div className="scrollbar-hide mb-4 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname === `${item.href}/` || pathname?.startsWith(item.href + "/");
                return (
                  <NavButton
                    key={item.href}
                    href={item.href}
                    variant={active ? "mobile-active" : "mobile"}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavButton>
                );
              })}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <Button href={contactHref} variant="default" className="w-full justify-center">
              <Icon icon="mdi:email-outline" width={16} height={16} className="mr-2" />
              お問い合わせ
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
