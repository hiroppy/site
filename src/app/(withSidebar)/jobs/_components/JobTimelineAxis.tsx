import { cn } from "../../../../utils/cn";
import type { DateRange } from "../_utils/jobs/timelineCalculations";
import { generateTimeMarkers } from "../_utils/jobs/timelineCalculations";

type Props = {
  dateRange: DateRange;
};

export function JobTimelineAxis({ dateRange }: Props) {
  const markers = generateTimeMarkers(dateRange.start, dateRange.end);

  return (
    <div className="border-line relative h-10 border-b">
      {markers.map((marker, index) => (
        <div
          key={index}
          className={cn(
            "absolute top-0 flex -translate-x-1/2 flex-col items-center",
            !marker.isMajor &&
              "hidden md:flex lg:[&:nth-child(3n)]:hidden xl:flex",
          )}
          style={{ left: `${marker.position}%` }}
        >
          {/* Marker Line */}
          <div
            className={cn(
              "w-px",
              marker.isMajor ? "bg-text-sub h-3" : "bg-line h-2",
            )}
          />
          {/* Marker Label */}
          <div
            className={cn(
              "mt-1 text-xs whitespace-nowrap",
              marker.isMajor
                ? "text-text-main font-semibold"
                : "text-text-sub font-normal",
            )}
          >
            {marker.label}
          </div>
        </div>
      ))}
    </div>
  );
}
