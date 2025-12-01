import { useState } from "preact/hooks";
import { Avatar } from "./Avatar";
import { NavButton } from "./NavButton";
import { Icon } from "./Icon";
import { cn } from "../utils/cn";
import { ContactButton } from "./ContactButton";
import { NAV_ITEMS, type NavItem } from "../constants";

type Props = {
  variant?: "default" | "fullscreen";
  currentPath: string;
};

export function Header({ variant = "default", currentPath }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFullscreenPage = variant === "fullscreen";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (item: NavItem) => {
    if (item.href === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(item.href);
  };

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div
        className={cn("mx-auto px-6 py-4", isFullscreenPage ? "" : "container")}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a href="/">
              <Avatar alt="Hiroppy" src="/images/meta/me.png" />
            </a>
          </div>
          <nav
            className="hidden items-center justify-center space-x-2 md:flex"
            aria-label="メインナビゲーション"
          >
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.href}
                variant={isActive(item) ? "active" : "default"}
                href={item.href}
              >
                {item.label}
              </NavButton>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="mobile-menu text-text-main hover:bg-surface focus:ring-link inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:outline-none focus:ring-inset md:hidden"
              aria-label="menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon icon="mdi:menu" width={16} height={16} />
            </button>
            <ContactButton className="hidden md:flex" />
          </div>
        </div>
        {/* Mobile menu */}
        <nav
          className={cn("md:hidden", !isMobileMenuOpen && "hidden")}
          aria-label="モバイルナビゲーション"
        >
          <div className="px-2 pt-6 pb-3">
            {/* Horizontal Scrollable Navigation */}
            <div className="scrollbar-hide mb-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {NAV_ITEMS.map((item) => (
                  <NavButton
                    key={item.href}
                    variant={isActive(item) ? "mobile-active" : "mobile"}
                    href={item.href}
                    className="shrink-0"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </div>
            </div>
            <div className="border-line border-t pt-4">
              <ContactButton variant="full" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
