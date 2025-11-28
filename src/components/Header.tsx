import { useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { NavButton } from "./NavButton";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";
import { cn } from "../utils/cn";
import meImage from "../assets/images/meta/me.png";
import meta from "../../node_modules/hiroppy/generated/meta.json";

type HeaderProps = {
  variant?: "default" | "fullscreen";
  currentPath: string;
};

type NavLink = {
  href: string;
  label: string;
  pathMatch?: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/media", label: "Media", pathMatch: "/media" },
  { href: "/jobs", label: "Jobs", pathMatch: "/jobs" },
  { href: "/blog", label: "Blog", pathMatch: "/blog" },
  { href: "/labs", label: "Labs", pathMatch: "/labs" },
];

export function Header({ variant = "default", currentPath }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFullscreenPage = variant === "fullscreen";
  const contactFormUrl = meta.form.request;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (link: NavLink): boolean => {
    if (link.pathMatch) {
      return currentPath.startsWith(link.pathMatch);
    }
    return currentPath === link.href || currentPath === `${link.href}/`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div
        className={cn("mx-auto px-6 py-4", isFullscreenPage ? "" : "container")}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a
              href="/"
              className="inline-flex items-center space-x-3"
              aria-label="Hiroppy ホームページに戻る"
            >
              <div id="header-avatar">
                <Avatar className="ring-2 ring-blue-500">
                  <img
                    src={meImage.src}
                    alt="Hiroppy"
                    className="h-full w-full object-cover"
                    width={80}
                    height={80}
                    loading="eager"
                  />
                </Avatar>
              </div>
            </a>
          </div>
          <nav
            className="hidden items-center justify-center space-x-2 md:flex"
            aria-label="メインナビゲーション"
          >
            {NAV_LINKS.map((link) => (
              <NavButton
                key={link.href}
                variant={isActive(link) ? "active" : "default"}
                href={link.href}
              >
                {link.label}
              </NavButton>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <button
              id="mobile-menu-button"
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">メニューを開く</span>
              <Icon icon="mdi:menu" width="24" height="24" />
            </button>
            <ThemeToggle />
            <Button
              variant="default"
              size="sm"
              href={contactFormUrl}
              className="hidden md:flex"
            >
              <Icon
                icon="mdi:email-outline"
                className="mr-2"
                width="16"
                height="16"
              />
              お問い合わせ
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        <nav
          id="mobile-menu"
          className={cn("md:hidden", isMobileMenuOpen ? "" : "hidden")}
          aria-label="モバイルナビゲーション"
        >
          <div className="px-2 pt-6 pb-3">
            {/* Horizontal Scrollable Navigation */}
            <div className="scrollbar-hide mb-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2" onClick={closeMobileMenu}>
                {NAV_LINKS.map((link) => (
                  <NavButton
                    key={`mobile-${link.href}`}
                    variant={isActive(link) ? "mobile-active" : "mobile"}
                    href={link.href}
                    className="shrink-0"
                  >
                    {link.label}
                  </NavButton>
                ))}
              </div>
            </div>
            {/* Contact Button */}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                variant="default"
                href={contactFormUrl}
                className="w-full justify-center"
              >
                <Icon
                  icon="mdi:email-outline"
                  className="mr-2"
                  width="16"
                  height="16"
                />
                お問い合わせ
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
