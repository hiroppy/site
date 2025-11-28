/**
 * Get language-specific color classes for programming languages
 * @param language - Programming language name
 * @returns CSS class string for the language color
 */
function getLanguageColorClass(language: string | null) {
  if (!language) return "";

  switch (language) {
    case "JavaScript":
      return "bg-javascript";
    case "TypeScript":
      return "bg-typescript";
    case "HTML":
      return "bg-html";
    case "CSS":
      return "bg-css dark:bg-css-dark";
    case "Go":
      return "bg-go";
    case "Rust":
      return "bg-rust";
    default:
      return "bg-gray-400 dark:bg-gray-600"; // Default color for unknown languages
  }
}

/**
 * Get a smaller language color indicator (dot)
 * @param language - Programming language name
 * @returns JSX element for a language color dot
 */
export function getLanguageDot(language: string | null) {
  const colorClass = getLanguageColorClass(language);
  return `${colorClass} h-2 w-2 rounded-full`;
}
