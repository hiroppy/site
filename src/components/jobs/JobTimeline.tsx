import { useState } from "react";
import history from "../../../node_modules/hiroppy/generated/jobs.json";
import { JobTimelineAxis } from "./JobTimelineAxis";
import { JobTimelineBar } from "./JobTimelineBar";
import {
  calculateDateRange,
  calculatePosition,
  calculateDurationMonths,
  generateTimeMarkers,
  type TimelineJob,
} from "../../utils/jobs/timelineCalculations";
import { cn } from "../../utils/cn";

type TimelineFilter = "all" | "main" | "side";
type JobMetaData = typeof history.meta;

type CompanyMeta = {
  image: string;
  url: string;
};

// Active button classes
const ACTIVE_CLASSES = [
  "border-blue-600",
  "bg-blue-600",
  "text-white",
  "shadow-sm",
  "dark:border-blue-600",
  "dark:bg-blue-600",
];

// Inactive button classes
const INACTIVE_CLASSES = [
  "border-gray-300",
  "bg-white",
  "text-gray-700",
  "hover:bg-gray-100",
  "dark:border-gray-600",
  "dark:bg-gray-800",
  "dark:text-gray-200",
  "dark:hover:bg-gray-700",
];

// Helper function to safely get company metadata
function getCompanyMeta(
  metadata: JobMetaData,
  companyKey: string,
): CompanyMeta {
  const companyMeta = metadata[companyKey as keyof JobMetaData];
  if (!companyMeta || typeof companyMeta !== "object") {
    throw new Error(`Company metadata not found for: ${companyKey}`);
  }
  return companyMeta as CompanyMeta;
}

// Transform and merge job data
const allJobs: TimelineJob[] = [
  ...history.main.map((job, i) => {
    const meta = getCompanyMeta(history.meta, job.company);
    return {
      id: `main-${i}`,
      name: job.name,
      company: job.company,
      position: job.position,
      start: new Date(job.start),
      end: job.end ? new Date(job.end) : null,
      type: "main" as const,
      logo: meta.image,
      url: meta.url,
      row: 0,
      startPercent: 0,
      widthPercent: 0,
      durationMonths: 0,
      isActive: job.end === null,
    };
  }),
  ...history.side.map((job, i) => {
    const meta = getCompanyMeta(history.meta, job.company);
    return {
      id: `side-${i}`,
      name: job.name,
      company: job.company,
      position: job.position,
      start: new Date(job.start),
      end: job.end ? new Date(job.end) : null,
      type: "side" as const,
      logo: meta.image,
      url: meta.url,
      row: 0,
      startPercent: 0,
      widthPercent: 0,
      durationMonths: 0,
      isActive: job.end === null,
    };
  }),
];

// Calculate date range
const dateRange = calculateDateRange(allJobs);

// Generate time markers for vertical lines
const timeMarkers = generateTimeMarkers(dateRange.start, dateRange.end);

const filterOptions: { key: TimelineFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "main", label: "Main only" },
  { key: "side", label: "Sub only" },
];

const sortJobs = (jobs: TimelineJob[]) => {
  return [...jobs].sort((a, b) => {
    const aIsActive = a.end === null;
    const bIsActive = b.end === null;

    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;

    if (aIsActive && bIsActive) {
      if (a.type !== b.type) {
        return a.type === "main" ? -1 : 1;
      }

      const aDuration = calculateDurationMonths(a.start, a.end);
      const bDuration = calculateDurationMonths(b.start, b.end);

      if (aDuration !== bDuration) {
        return bDuration - aDuration;
      }

      return b.start.getTime() - a.start.getTime();
    }

    return (b.end?.getTime() || 0) - (a.end?.getTime() || 0);
  });
};

const prepareTimelineJobs = (jobs: TimelineJob[]) => {
  const sortedJobs = sortJobs(jobs).map((job) => ({ ...job }));

  sortedJobs.forEach((job, index) => {
    job.row = index;

    const { startPercent, widthPercent } = calculatePosition(
      job,
      dateRange.start,
      dateRange.end,
    );

    job.startPercent = startPercent;
    job.widthPercent = widthPercent;
    job.durationMonths = calculateDurationMonths(job.start, job.end);
  });

  return sortedJobs;
};

// Prepare all timeline views
const timelineViews = filterOptions.map(({ key }) => {
  const filteredJobs =
    key === "all" ? allJobs : allJobs.filter((job) => job.type === key);
  const jobs = prepareTimelineJobs(filteredJobs);

  return {
    key,
    jobs,
    height: jobs.length * 72,
  };
});

export function JobTimeline() {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");

  const handleBarClick = (jobId: string) => {
    const element = document.getElementById(jobId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Add a brief highlight effect
    element.classList.add("ring-2", "ring-blue-500");
    setTimeout(() => {
      element.classList.remove("ring-2", "ring-blue-500");
    }, 2000);
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {filterOptions.map(({ key, label }) => {
          const isActive = key === activeFilter;
          return (
            <button
              key={key}
              type="button"
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-gray-900",
                isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES,
              )}
              onClick={() => setActiveFilter(key)}
              aria-pressed={isActive ? "true" : "false"}
            >
              {label}
            </button>
          );
        })}
      </div>

      {timelineViews.map(({ key, jobs, height }) => {
        if (key !== activeFilter) return null;

        return (
          <div key={key} data-timeline-view={key}>
            <div
              className="timeline-container relative w-full overflow-x-auto overflow-y-auto rounded-lg bg-white px-6 shadow-sm dark:bg-gray-900"
              style={{ maxHeight: "400px" }}
              data-testid="job-timeline"
            >
              <div
                className="sticky top-0 z-10 bg-white py-2 dark:bg-gray-900"
                style={{ minWidth: "2800px" }}
              >
                <JobTimelineAxis dateRange={dateRange} />
              </div>

              <div
                className="relative"
                style={{ height: `${height}px`, minWidth: "2800px" }}
              >
                {timeMarkers.map((marker, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute top-0 w-px",
                      marker.isMajor
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-gray-200 dark:bg-gray-800",
                    )}
                    style={{ left: `${marker.position}%`, height: "100%" }}
                  />
                ))}

                {jobs.map((job) => (
                  <JobTimelineBar
                    key={job.id}
                    job={job}
                    onClick={handleBarClick}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .timeline-container {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
