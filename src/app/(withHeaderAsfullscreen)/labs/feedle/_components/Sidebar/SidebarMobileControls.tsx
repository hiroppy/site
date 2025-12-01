"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { MdMenu } from "react-icons/md";

type Props = {
  children: ReactNode;
};

export function SidebarMobileControls({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Resize listener - close sidebar when switching to desktop
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Close sidebar when clicking links on mobile
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || typeof window === "undefined") return;

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 768 && target.closest("a")) {
        setIsSidebarOpen(false);
      }
    };

    sidebar.addEventListener("click", handleLinkClick);
    return () => {
      sidebar.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const sidebarTransformClass = isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full";
  const backdropClass = isSidebarOpen
    ? "pointer-events-auto opacity-100"
    : "pointer-events-none opacity-0";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden ${backdropClass}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r border-gray-200 bg-gray-50 transition-transform duration-300 ease-in-out md:relative md:z-auto md:h-full md:translate-x-0 ${sidebarTransformClass}`}
      >
        {children}
      </aside>
      <button
        className="fixed top-20 left-4 z-40 rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-gray-100 md:hidden"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <MdMenu className="h-6 w-6 text-gray-600" />
      </button>
    </>
  );
}
