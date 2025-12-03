"use client";

import { usePathname } from "next/navigation";
import { cn } from "../_utils/cn";
import { NAV_ITEMS } from "../_utils/constants";
import { Avatar } from "./Avatar";
import { ContactButton } from "./ContactButton";
import { Link } from "./Link";
import { ListContainer } from "./ListContainer";

export function Sidebar() {
  const currentPath = usePathname();

  return (
    <aside className="space-y-8 md:sticky md:top-20 md:h-fit md:w-60 md:shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-2xl font-medium tracking-wider">
          <Avatar src="/images/meta/me.png" alt="hiroppy" size="md" />
          hiroppy
        </div>

        <p className="text-text-sub text-sm leading-relaxed">
          Web Engineer in Tokyo.
          <br />
          Likes Open Source, Sauna, and Games.
        </p>

        <ContactButton variant="full" />
      </div>

      <nav>
        <ListContainer className="nav-list flex flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  unstyled
                  className={cn(
                    "text-text-main block pb-1 text-lg transition-opacity duration-300",
                    "hover:opacity-60",
                    isActive && "border-accent border-b font-medium",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ListContainer>
      </nav>

      <div className="flex gap-4 text-base">
        <Link
          href="https://github.com/hiroppy"
          unstyled
          className="text-link transition-opacity duration-300 hover:underline hover:opacity-60"
        >
          GitHub
        </Link>
        <Link
          href="https://x.com/about_hiroppy"
          unstyled
          className="text-link transition-opacity duration-300 hover:underline hover:opacity-60"
        >
          X
        </Link>
      </div>
    </aside>
  );
}
