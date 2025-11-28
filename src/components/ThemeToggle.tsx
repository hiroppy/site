import { useTheme } from "../hooks/useTheme";
import { Button } from "./Button";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { mounted, toggleTheme } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        ariaLabel="Toggle theme"
        disabled
      >
        <span className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      id="theme-toggle"
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={toggleTheme}
      ariaLabel="Toggle theme"
    >
      <Icon
        icon="mdi:weather-sunny"
        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        width="20"
        height="20"
      />
      <Icon
        icon="mdi:moon-waning-crescent"
        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        width="20"
        height="20"
      />
    </Button>
  );
}
