"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { NAV_ITEMS } from "../constants";
import { cn } from "../utils/cn";
import { isActiveNavCurrentPath } from "../utils/isActiveNavCurrentPath";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { ContactButton } from "./ContactButton";
import { Link } from "./Link";

type Props = {
  variant?: "default" | "fullscreen";
  className?: string;
};

export function Header({ variant = "default", className }: Props) {
  const currentPath = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFullscreenPage = variant === "fullscreen";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [currentPath]);

  return (
    <header
      className={cn(
        "border-line bg-bg/80 sticky top-0 z-50 w-full border-b backdrop-blur-md",
        !isMobileMenuOpen && "h-(--header-height)",
        className,
      )}
    >
      <div
        className={cn("mx-auto px-6 py-4", isFullscreenPage ? "" : "container")}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Link href="/" unstyled className="inline-block">
              <Avatar alt="Hiroppy" src="/images/meta/me.png" />
            </Link>
          </div>
          <nav
            className="hidden items-center justify-center space-x-2 md:flex"
            aria-label="メインナビゲーション"
          >
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.href}
                variant={
                  isActiveNavCurrentPath(item.href, currentPath)
                    ? "active"
                    : "default"
                }
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
              <MdMenu size={16} aria-hidden="true" focusable="false" />
            </button>
            <ContactButton className="hidden md:flex" />
          </div>
        </div>
        <nav
          className={cn("md:hidden", !isMobileMenuOpen && "hidden")}
          aria-label="モバイルナビゲーション"
        >
          <div className="px-2 pt-6 pb-3">
            <div className="mb-4 space-y-3 pb-2">
              {NAV_ITEMS.map((item) => (
                <NavButton
                  key={item.href}
                  variant={
                    isActiveNavCurrentPath(item.href, currentPath)
                      ? "mobile-active"
                      : "mobile"
                  }
                  href={item.href}
                  className="w-full justify-start text-left"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavButton>
              ))}
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

type NavButtonProps = {
  variant?: "default" | "active" | "mobile" | "mobile-active";
  className?: string;
  id?: string;
  onClick?: () => void;
  children?: ReactNode;
  href: string;
};

function NavButton({
  variant = "default",
  className,
  id,
  onClick,
  children,
  href,
}: NavButtonProps) {
  const isActive = variant === "active" || variant === "mobile-active";
  const isMobile = variant === "mobile" || variant === "mobile-active";

  return (
    <Button
      id={id}
      active={isActive}
      variant="ghost"
      size={isMobile ? "default" : "sm"}
      className={className}
      onClick={onClick}
      href={href}
    >
      {children}
    </Button>
  );
}
