"use client";

import type history from "hiroppy/generated/jobs.json";
import { useState } from "react";
import { JobSection } from "./JobSection";
import { JobTimeline } from "./JobTimeline";

type TimelineFilter = "all" | "main" | "side";

export type JobItemWithParsedDescription = {
  name: string;
  start: string;
  end: string | null;
  position: string;
  initialState: string;
  description: string;
  company: string;
  links: Array<{
    title: string;
    description?: string;
    image?: string;
    url: string;
    name?: string;
  }>;
};

type Props = {
  mainJobs: JobItemWithParsedDescription[];
  sideJobs: JobItemWithParsedDescription[];
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
