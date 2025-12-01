import { cn } from "../../utils/cn";

type Props = {
  currentType: string;
  currentCategory: string;
  currentService?: string;
  currentPeriod?: string;
};

export function DateFilter({
  currentType,
  currentCategory,
  currentService,
  currentPeriod,
}: Props) {
  const buildUrl = (period: string) => {
    let url = `/labs/feedle/${currentType}`;

    if (currentCategory !== "all") {
      url += `/${currentCategory}`;

      if (currentService) {
        url += `/${currentService}`;
      }
    }

    if (period !== "all") {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}period=${period}`;
    }

    return url;
  };

  const periods = [
    { key: "all", label: "All" },
    { key: "month", label: "Month" },
    { key: "today", label: "Today" },
  ];

  return (
    <div class="flex space-x-1">
      {periods.map((period) => (
        <a
          href={buildUrl(period.key)}
          class={cn(
            "flex-1 rounded-lg px-2 py-1.5 text-center text-xs font-medium transition-colors",
            (currentPeriod || "all") === period.key
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200",
          )}
        >
          {period.label}
        </a>
      ))}
    </div>
  );
}
