/**
 * Get language-specific color classes for programming languages
 * @param language - Programming language name
 * @returns CSS class string for the language color
 */
export function getLanguageColorClass(language: string | null) {
  if (!language) return "";

  switch (language) {
    case "JavaScript":
      return "bg-yellow-400";
    case "TypeScript":
      return "bg-blue-600";
    case "CSS":
      return "bg-purple-500 dark:bg-purple-400";
    case "Python":
      return "bg-blue-500";
    case "Go":
      return "bg-cyan-500";
    case "Rust":
      return "bg-orange-600";
    case "Java":
      return "bg-red-500";
    case "C++":
      return "bg-pink-500";
    case "C":
      return "bg-gray-600";
    case "PHP":
      return "bg-indigo-500";
    case "Ruby":
      return "bg-red-600";
    case "Swift":
      return "bg-orange-500";
    case "Kotlin":
      return "bg-purple-600";
    case "Dart":
      return "bg-sky-500";
    case "Shell":
      return "bg-green-500";
    case "HTML":
      return "bg-red-500";
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
  return `${colorClass} h-3 w-3 rounded-full`;
}
