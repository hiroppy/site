import { twMerge } from "tailwind-merge";

export function mergeClass(baseClass: string, newClass: string) {
  return twMerge(baseClass, newClass);
}
