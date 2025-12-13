import { Image } from "../../../../components/Image";
import { cn } from "../../../../utils/cn";
import type { TimelineJob } from "../_utils/jobs/timelineCalculations";
import { formatDuration } from "../_utils/jobs/timelineCalculations";

type Props = {
  job: TimelineJob;
  onClick?: (jobId: string) => void;
};

export function JobTimelineBar({ job, onClick }: Props) {
  const isMain = job.type === "main";

  const barClasses = cn(
    "group absolute cursor-pointer rounded-lg border text-left transition-all duration-200",
    "hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    isMain ? "border-[#67e8f9] bg-[#e0f2fe]" : "border-[#6ee7b7] bg-[#d1fae5]",
  );

  const topPosition = job.row * 72;
  const durationText = formatDuration(job.durationMonths);

  const positionStyle = {
    left: `${job.startPercent}%`,
    width: `${job.widthPercent}%`,
    top: `${topPosition}px`,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(job.id);
    }
  };

  return (
    <button
      type="button"
      className={barClasses}
      style={positionStyle}
      data-job-id={job.id}
      data-job-type={job.type}
      data-timeline-bar
      title={`${job.name} - ${job.position} (${durationText})`}
      aria-label={`${job.name}の詳細にスクロール`}
      onClick={handleClick}
    >
      <div className="flex h-16 items-center gap-2 px-2 py-2 lg:h-16 lg:px-3">
        <div className="shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm lg:h-10 lg:w-10">
            <Image
              src={job.logo}
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 rounded-full object-contain p-0.5 lg:h-8 lg:w-8"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-text-main text-sm font-bold whitespace-nowrap lg:text-base">
            {job.name}
          </div>
          <div className="text-text-sub flex items-center gap-1.5 text-xs lg:text-xs">
            <span className="font-medium whitespace-nowrap">
              {job.position}
            </span>
            <span className="shrink-0">{"/"}</span>
            <span className="shrink-0">{durationText}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
