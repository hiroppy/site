import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get initial theme from localStorage or current class
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = theme === "dark" ? "light" : "dark";

    // Update DOM
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Update localStorage
    localStorage.setItem("theme", newTheme);

    // Update state
    setTheme(newTheme);
  };

  const setThemeValue = (newTheme: Theme) => {
    if (!mounted) return;

    // Update DOM
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Update localStorage
    localStorage.setItem("theme", newTheme);

    // Update state
    setTheme(newTheme);
  };

  return {
    theme,
    mounted,
    toggleTheme,
    setTheme: setThemeValue,
  };
}
