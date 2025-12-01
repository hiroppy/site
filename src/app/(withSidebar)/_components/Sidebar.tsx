"use client";

import meta from "hiroppy/generated/meta.json";
import { usePathname } from "next/navigation";
import { Avatar } from "../../../components/Avatar";
import { ContactButton } from "../../../components/ContactButton";
import { Link } from "../../../components/Link";
import { ListContainer } from "../../../components/ListContainer";
import { NAV_ITEMS } from "../../../constants";
import { cn } from "../../../utils/cn";
import { isActiveNavCurrentPath } from "../../../utils/isActiveNavCurrentPath";

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
          CEO at Coder Penguin LLC.
        </p>
        <ContactButton variant="full" />
      </div>
      <nav>
        <ListContainer className="nav-list flex flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = isActiveNavCurrentPath(item.href, currentPath);

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
          href={meta.sns.github}
          unstyled
          className="text-link transition-opacity duration-300 hover:underline hover:opacity-60"
        >
          GitHub
        </Link>
        <Link
          href={meta.sns.twitter}
          unstyled
          className="text-link transition-opacity duration-300 hover:underline hover:opacity-60"
        >
          X
        </Link>
      </div>
    </aside>
  );
}
