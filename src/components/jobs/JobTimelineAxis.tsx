import type { DateRange } from "../../utils/jobs/timelineCalculations";
import { generateTimeMarkers } from "../../utils/jobs/timelineCalculations";
import { cn } from "../../utils/cn";

type Props = {
  dateRange: DateRange;
};

export function JobTimelineAxis({ dateRange }: Props) {
  const markers = generateTimeMarkers(dateRange.start, dateRange.end);

  return (
    <div className="relative h-10 border-b border-gray-300 dark:border-gray-700">
      {markers.map((marker, index) => (
        <div
          key={index}
          className={cn(
            "absolute top-0 flex flex-col items-center",
            marker.isMajor ? "timeline-marker-major" : "timeline-marker-minor",
          )}
          style={{ left: `${marker.position}%`, transform: "translateX(-50%)" }}
        >
          {/* Marker Line */}
          <div
            className={cn(
              "w-px",
              marker.isMajor
                ? "h-3 bg-gray-400 dark:bg-gray-600"
                : "h-2 bg-gray-300 dark:bg-gray-700",
            )}
          />
          {/* Marker Label */}
          <div
            className={cn(
              "mt-1 text-xs whitespace-nowrap",
              marker.isMajor
                ? "font-semibold text-gray-700 dark:text-gray-300"
                : "text-gray-500 dark:text-gray-500",
            )}
          >
            {marker.label}
          </div>
        </div>
      ))}
    </div>
  );
}
