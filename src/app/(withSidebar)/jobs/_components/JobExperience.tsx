"use client";

import type history from "hiroppy/generated/jobs.json";
import type { Jobs } from "hiroppy/types";
import { useRef, useState } from "react";
import { Dialog, DialogHandle } from "../../../../components/Dialog";
import { JobSection } from "./JobSection";
import { JobTimeline } from "./JobTimeline";

type TimelineFilter = "all" | "main" | "side";

type Props = {
  mainJobs: Jobs["main"];
  sideJobs: Jobs["side"];
  meta: typeof history.meta;
};

export function JobExperience({ mainJobs, sideJobs, meta }: Props) {
  const dialogRef = useRef<DialogHandle>(null);
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");

  const showMain = activeFilter === "all" || activeFilter === "main";
  const showSide = activeFilter === "all" || activeFilter === "side";

  return (
    <>
      <div className="space-y-8">
        <JobTimeline
          activeFilter={activeFilter}
          isFullscreen={false}
          onChangeFilter={setActiveFilter}
          onOpenFullscreen={() => {
            dialogRef.current?.showModal();
            document.body.style.overflow = "hidden";
          }}
        />
        <div className="flex flex-col gap-12">
          {showMain && (
            <JobSection title="Main Job" meta={meta} items={mainJobs} />
          )}
          {showSide && (
            <JobSection title="My Company" meta={meta} items={sideJobs} />
          )}
        </div>
      </div>

      <Dialog
        id="timeline-fullscreen-dialog"
        title="Work Timeline"
        maxWidth="max-w-[95vw]"
        contentClass="h-[85vh] p-6 flex flex-col overflow-hidden"
        backdrop="blur"
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "initial";
        }}
      >
        <JobTimeline
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
          isFullscreen
          disableBarClick
        />
      </Dialog>
    </>
  );
}
