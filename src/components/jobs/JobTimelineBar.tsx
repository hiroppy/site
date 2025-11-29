import type { TimelineJob } from "../../utils/jobs/timelineCalculations";
import { formatDuration } from "../../utils/jobs/timelineCalculations";
import { Image } from "../Image";
import { cn } from "../../utils/cn";

type Props = {
  job: TimelineJob;
  onClick?: (jobId: string) => void;
};

export function JobTimelineBar({ job, onClick }: Props) {
  const barClasses = cn(
    "absolute rounded-lg shadow-sm transition-all duration-200 group cursor-pointer text-left",
    "hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none",
    job.type === "main"
      ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-700/45 dark:hover:bg-cyan-700/55"
      : "bg-green-100 hover:bg-green-200 dark:bg-green-700/45 dark:hover:bg-green-700/55",
  );

  const textColorClass =
    job.type === "main"
      ? "text-gray-600 dark:text-cyan-400"
      : "text-gray-600 dark:text-green-400";

  const topPosition = job.row * 72;
  const durationText = formatDuration(job.durationMonths);

  const handleClick = () => {
    if (onClick) {
      onClick(job.id);
    }
  };

  return (
    <button
      type="button"
      className={barClasses}
      style={{
        left: `${job.startPercent}%`,
        width: `${job.widthPercent}%`,
        top: `${topPosition}px`,
      }}
      data-job-id={job.id}
      data-job-type={job.type}
      data-timeline-bar
      title={`${job.name} - ${job.position} (${durationText})`}
      aria-label={`${job.name}の詳細にスクロール`}
      onClick={handleClick}
    >
      <div className="flex h-16 items-start gap-2 px-2 py-2 lg:h-16 lg:px-3">
        {/* Company Logo */}
        <div className="shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm lg:h-10 lg:w-10">
            <Image
              src={job.logo}
              alt={job.name}
              width={32}
              height={32}
              className="h-6 w-6 rounded-full object-contain p-0.5 lg:h-8 lg:w-8"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold whitespace-nowrap text-gray-900 lg:text-base dark:text-white">
            {job.name}
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs lg:text-xs",
              textColorClass,
            )}
          >
            <span className="font-medium whitespace-nowrap">{job.position}</span>
            <span className="shrink-0">{"/"}</span>
            <span className="shrink-0">{durationText}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
