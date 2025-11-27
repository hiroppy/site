"use client";

import { useState } from "react";
import { cn } from "@site/utils/cn";

type TimelineFilter = "all" | "main" | "side";

type Marker = {
  position: number;
  label: string;
  isMajor: boolean;
};

type TimelineJob = {
  id: string;
  name: string;
  position: string;
  type: TimelineFilter;
  durationLabel: string;
  startPercent: number;
  widthPercent: number;
  logo?: string;
  url?: string;
  isActive: boolean;
  row: number;
};

type TimelineView = {
  key: TimelineFilter;
  jobs: TimelineJob[];
  height: number;
};

const MIN_WIDTH = 2800;

const filterOptions: { key: TimelineFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "main", label: "Main only" },
  { key: "side", label: "Sub only" },
];

export function Timeline({
  views,
  markers,
}: {
  views: TimelineView[];
  markers: Marker[];
}) {
  const [filter, setFilter] = useState<TimelineFilter>("all");

  const handleBarClick = (jobId: string) => {
    const target = document.getElementById(jobId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("ring-2", "ring-blue-500");
    setTimeout(() => {
      target.classList.remove("ring-2", "ring-blue-500");
    }, 1600);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-[#2a3d58] dark:bg-[#1f2f47]">
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map(({ key, label }) => {
          const isActive = key === filter;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {views.map(({ key, jobs, height }) => (
        <div
          key={key}
          className={cn(key === filter ? "block" : "hidden")}
          data-timeline-view={key}
        >
          <div
            className="relative w-full overflow-x-auto overflow-y-auto rounded-lg bg-white px-4 shadow-sm ring-1 ring-gray-200 dark:bg-[#1b2740] dark:ring-[#233452]"
            style={{ maxHeight: 420 }}
          >
            <div className="sticky top-0 z-10 bg-white py-2 dark:bg-[#1b2740]" style={{ minWidth: MIN_WIDTH }}>
              <div className="relative h-10 border-b border-gray-300 dark:border-[#2a3d58]">
                {markers.map((marker) => (
                  <div
                    key={marker.label + marker.position}
                    className={cn(
                      "absolute top-0 flex flex-col items-center",
                      marker.isMajor ? "timeline-marker-major" : "timeline-marker-minor",
                    )}
                    style={{
                      left: `${marker.position}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                    className={cn(
                      "w-px",
                      marker.isMajor ? "h-3 bg-gray-400 dark:bg-slate-600" : "h-2 bg-gray-200 dark:bg-slate-700",
                    )}
                  />
                  <div
                    className={cn(
                      "mt-1 whitespace-nowrap text-xs",
                      marker.isMajor ? "font-semibold text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {marker.label}
                  </div>
                </div>
                ))}
              </div>
            </div>

            <div className="relative" style={{ height, minWidth: MIN_WIDTH }}>
              {markers.map((marker) => (
                <div
                  key={`line-${marker.label}-${marker.position}`}
                  className={cn(
                    "pointer-events-none absolute top-0 w-px",
                    marker.isMajor ? "bg-gray-300 dark:bg-slate-700" : "bg-gray-200 dark:bg-slate-800",
                  )}
                  style={{ left: `${marker.position}%`, height: "100%" }}
                />
              ))}

              {jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => handleBarClick(job.id)}
                    className={cn(
                      "group absolute rounded-lg shadow-sm transition-all duration-200 text-left",
                      "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      job.type === "main"
                        ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-800/60 dark:hover:bg-cyan-700/60"
                        : "bg-green-100 hover:bg-green-200 dark:bg-green-800/60 dark:hover:bg-green-700/60",
                    )}
                  style={{
                    left: `${job.startPercent}%`,
                    width: `${job.widthPercent}%`,
                    top: `${job.row * 72}px`,
                  }}
                  title={`${job.name} - ${job.position} (${job.durationLabel})`}
                >
                  <div className="flex h-16 items-start gap-2 px-2 py-2 lg:h-16 lg:px-3">
                    {job.logo ? (
                      <div className="shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm lg:h-10 lg:w-10">
                          <img
                            src={job.logo}
                            alt={job.name}
                            className="h-6 w-6 rounded-full object-contain p-0.5 lg:h-8 lg:w-8"
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-nowrap text-sm font-bold text-slate-900 lg:text-base">
                        {job.name}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs lg:text-xs",
                          "text-slate-600 dark:text-slate-100",
                        )}
                      >
                        <span className="font-medium whitespace-nowrap">{job.position}</span>
                        <span className="shrink-0">/</span>
                        <span className="shrink-0">{job.durationLabel}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
