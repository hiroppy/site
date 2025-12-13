import { NavItem } from "../constants";

export function isActiveNavCurrentPath(
  item: NavItem["href"],
  currentPath: string,
) {
  if (item === "/") {
    if (currentPath === "/" || !currentPath) {
      return true;
    }

    return false;
  }

  if (item === "/media/all" && currentPath.startsWith("/media")) {
    return true;
  }

  if (item === "/blog/1" && currentPath.startsWith("/blog")) {
    return true;
  }

  return currentPath.startsWith(item);
}
