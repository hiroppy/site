import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../constants";

export function useActiveNavPath() {
  const currentPath = usePathname();
  // これをしないとvercelのcacheで不整合が起きる
  const [mounted, setMounted] = useState(false);
  const [activeNavPath, setActiveNavPath] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setActiveNavPath(getActiveNavPath(currentPath));
  }, [currentPath, mounted]);

  return activeNavPath;
}

function getActiveNavPath(currentPath: string) {
  if (currentPath === "/" || !currentPath) {
    return "/";
  }

  if (currentPath.startsWith("/media")) {
    return "/media/all";
  }

  if (currentPath.startsWith("/blog")) {
    return "/blog/1";
  }

  const sortedItems = [...NAV_ITEMS].sort(
    (a, b) => b.href.length - a.href.length,
  );

  for (const item of sortedItems) {
    if (item.href !== "/" && currentPath.startsWith(item.href)) {
      return item.href;
    }
  }

  return null;
}
