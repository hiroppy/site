export function mergeClass(baseClass: string, newClass: string) {
  const classes = Array.from(
    new Set([...baseClass.split(" "), ...newClass.split(" ")])
  )
    .join(" ")
    .trim();

  return classes;
}
