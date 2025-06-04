/**
 * Get language-specific color classes for programming languages
 * @param language - Programming language name
 * @returns CSS class string for the language color
 */
export function getLanguageColorClass(language: string | null): string {
  if (!language) return "";

  switch (language) {
    case "JavaScript":
      return "bg-javascript";
    case "TypeScript":
      return "bg-typescript";
    case "CSS":
      return "bg-css dark:bg-css-dark";
    case "Python":
      return "bg-python";
    case "Go":
      return "bg-go";
    case "Rust":
      return "bg-rust";
    case "Java":
      return "bg-java";
    case "C++":
      return "bg-cpp";
    case "C":
      return "bg-c";
    case "PHP":
      return "bg-php";
    case "Ruby":
      return "bg-ruby";
    case "Swift":
      return "bg-swift";
    case "Kotlin":
      return "bg-kotlin";
    case "Dart":
      return "bg-dart";
    case "Shell":
      return "bg-shell";
    case "HTML":
      return "bg-html";
    default:
      return "bg-gray-400 dark:bg-gray-600"; // Default color for unknown languages
  }
}

/**
 * Get a smaller language color indicator (dot)
 * @param language - Programming language name
 * @returns JSX element for a language color dot
 */
export function getLanguageDot(language: string | null): string {
  const colorClass = getLanguageColorClass(language);
  return `${colorClass} h-3 w-3 rounded-full`;
}
