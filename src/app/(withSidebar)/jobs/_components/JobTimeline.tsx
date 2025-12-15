import jobs from "hiroppy/generated/jobs.json";
import type { Jobs } from "hiroppy/types";
import { useState } from "react";
import { FilterTabs } from "../../../../components/FilterTabs";
import { cn } from "../../../../utils/cn";
import {
  type TimelineJob,
  calculateDateRange,
  calculateDurationMonths,
  calculatePosition,
  generateTimeMarkers,
} from "../_utils/jobs/timelineCalculations";
import { JobTimelineAxis } from "./JobTimelineAxis";
import { JobTimelineBar } from "./JobTimelineBar";

type TimelineFilter = "all" | "main" | "side";

type CompanyMeta = {
  image: string;
  url: string;
};

function getCompanyMeta(
  metadata: Jobs["meta"],
  companyKey: string,
): CompanyMeta {
  const companyMeta = metadata[companyKey as keyof Jobs["meta"]];
  if (!companyMeta || typeof companyMeta !== "object") {
    throw new Error(`Company metadata not found for: ${companyKey}`);
  }
  return companyMeta as CompanyMeta;
}

const allJobs: TimelineJob[] = [
  ...jobs.main.map((job, i) => {
    const meta = getCompanyMeta(jobs.meta, job.company);
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
  ...jobs.side.map((job, i) => {
    const meta = getCompanyMeta(jobs.meta, job.company);
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

const dateRange = calculateDateRange(allJobs);
const timeMarkers = generateTimeMarkers(dateRange.start, dateRange.end);

const filterTabs = [
  { value: "all" as const, label: "All" },
  { value: "main" as const, label: "Main" },
  { value: "side" as const, label: "Side" },
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

const timelineViews = filterTabs.map(({ value }) => {
  const filteredJobs =
    value === "all" ? allJobs : allJobs.filter((job) => job.type === value);
  const jobs = prepareTimelineJobs(filteredJobs);

  return {
    key: value,
    jobs,
    height: jobs.length * 72,
  };
});

type Props = {
  activeFilter?: TimelineFilter;
  onFilterChange?: (filter: TimelineFilter) => void;
};

export function JobTimeline({
  activeFilter: externalActiveFilter,
  onFilterChange,
}: Props) {
  const [internalActiveFilter, setInternalActiveFilter] =
    useState<TimelineFilter>("all");
  const activeFilter = externalActiveFilter ?? internalActiveFilter;

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

  const handleFilterChange = (key: TimelineFilter) => {
    if (onFilterChange) {
      onFilterChange(key);
    } else {
      setInternalActiveFilter(key);
    }
  };

  return (
    <div>
      <FilterTabs
        tabs={filterTabs}
        activeValue={activeFilter}
        onValueChange={handleFilterChange}
        className="mb-4"
      />

      {timelineViews.map(({ key, jobs, height }) => {
        if (key !== activeFilter) {
          return null;
        }

        return (
          <div key={key} data-timeline-view={key}>
            <div
              className="timeline-container border-line bg-bg relative max-h-100 w-full overflow-x-auto overflow-y-auto rounded border px-6"
              data-testid="job-timeline"
            >
              <div className="bg-bg sticky top-0 z-10 min-w-700 py-2">
                <JobTimelineAxis dateRange={dateRange} />
              </div>

              <div
                className="relative min-w-700"
                style={{ height: `${height}px` }}
              >
                {timeMarkers.map((marker, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute top-0 h-full w-px",
                      marker.isMajor ? "bg-line" : "bg-[rgb(224_224_224/0.5)]",
                    )}
                    style={{ left: `${marker.position}%` }}
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
    </div>
  );
}
