import { NavItem } from "../constants";

export function isActiveNavCurrentPath(
  item: NavItem["href"],
  currentPath: string,
) {
  if (item === "/") {
    console.log(item, currentPath);
    console.log(item === currentPath);
    console.log(JSON.stringify(item) === JSON.stringify(currentPath));

    if (currentPath === "/") {
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
