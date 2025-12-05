"use client";

import type history from "hiroppy/generated/jobs.json";
import type { Jobs } from "hiroppy/types";
import { useState } from "react";
import { JobSection } from "./JobSection";
import { JobTimeline } from "./JobTimeline";

type TimelineFilter = "all" | "main" | "side";

type Props = {
  mainJobs: Jobs["main"];
  sideJobs: Jobs["side"];
  meta: typeof history.meta;
};

export function JobExperience({ mainJobs, sideJobs, meta }: Props) {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");
  const showMain = activeFilter === "all" || activeFilter === "main";
  const showSide = activeFilter === "all" || activeFilter === "side";

  return (
    <div className="space-y-8">
      <JobTimeline
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="flex flex-col gap-12">
        {showMain && (
          <div>
            <JobSection title="Main Job" meta={meta} items={mainJobs} />
          </div>
        )}
        {showSide && (
          <div>
            <JobSection title="My Company" meta={meta} items={sideJobs} />
          </div>
        )}
      </div>
    </div>
  );
}
