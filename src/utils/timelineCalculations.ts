export type JobType = "main" | "side";

export interface TimelineJob {
  id: string;
  name: string;
  company: string;
  position: string;
  start: Date;
  end: Date | null;
  type: JobType;
  logo: string;
  url: string;
  row: number;
  startPercent: number;
  widthPercent: number;
  durationMonths: number;
  isActive: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeMarker {
  date: Date;
  label: string;
  isMajor: boolean;
  position: number;
}

/**
 * Calculate the date range for the timeline (reverse chronological)
 * Returns most recent date as start (left) and oldest as end (right)
 */
export function calculateDateRange(jobs: TimelineJob[]): DateRange {
  if (jobs.length === 0) {
    const now = new Date();
    return { start: now, end: now };
  }

  const starts = jobs.map((j) => j.start.getTime());
  const ends = jobs.map((j) => (j.end || new Date()).getTime());

  // For reverse chronological: most recent (largest) is start, oldest (smallest) is end
  return {
    start: new Date(Math.max(...starts, ...ends)),
    end: new Date(Math.min(...starts)),
  };
}

/**
 * Check if two jobs overlap in time
 */
export function hasOverlap(job1: TimelineJob, job2: TimelineJob): boolean {
  const end1 = job1.end || new Date();
  const end2 = job2.end || new Date();
  return job1.start < end2 && job2.start < end1;
}

/**
 * Assign rows to jobs to avoid overlaps using greedy algorithm
 */
export function assignRows(jobs: TimelineJob[]): TimelineJob[] {
  const sortedJobs = [...jobs].sort(
    (a, b) => b.start.getTime() - a.start.getTime(),
  );
  const rows: TimelineJob[][] = [];

  for (const job of sortedJobs) {
    let assigned = false;

    // Try to place in existing rows
    for (let i = 0; i < rows.length; i++) {
      const rowHasOverlap = rows[i].some((existingJob) =>
        hasOverlap(job, existingJob),
      );

      if (!rowHasOverlap) {
        job.row = i;
        rows[i].push(job);
        assigned = true;
        break;
      }
    }

    // Create new row if needed
    if (!assigned) {
      job.row = rows.length;
      rows.push([job]);
    }
  }

  return sortedJobs;
}

/**
 * Calculate position and width percentages for a job
 * For reverse chronological: 0% = present (left), 100% = past (right)
 */
export function calculatePosition(
  job: TimelineJob,
  timelineStart: Date,
  timelineEnd: Date,
): { startPercent: number; widthPercent: number } {
  const timelineDuration = timelineStart.getTime() - timelineEnd.getTime();
  const jobEnd = job.end || new Date();

  // Left edge position is based on END date (or current date for active jobs)
  // This ensures all active jobs align at 0% (left edge)
  const endDiff = timelineStart.getTime() - jobEnd.getTime();
  const jobDuration = jobEnd.getTime() - job.start.getTime();

  return {
    startPercent: (endDiff / timelineDuration) * 100,
    widthPercent: (jobDuration / timelineDuration) * 100,
  };
}

/**
 * Calculate duration in months
 */
export function calculateDurationMonths(start: Date, end: Date | null): number {
  const endDate = end || new Date();
  const years = endDate.getFullYear() - start.getFullYear();
  const months = endDate.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;
  return Math.max(1, totalMonths);
}

/**
 * Format duration as Japanese text (e.g., "3年4ヶ月")
 */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}年${remainingMonths}ヶ月`;
  } else if (years > 0) {
    return `${years}年`;
  } else {
    return `${remainingMonths}ヶ月`;
  }
}

/**
 * Filter jobs by date range
 */
export function filterJobsByDateRange(
  jobs: TimelineJob[],
  rangeStart: Date,
  rangeEnd: Date,
): TimelineJob[] {
  return jobs.filter((job) => {
    const jobEnd = job.end || new Date();
    // Include job if it overlaps with the filter range
    return job.start <= rangeEnd && jobEnd >= rangeStart;
  });
}

/**
 * Generate time markers for the axis
 * Only shows markers for January and July of each year
 */
export function generateTimeMarkers(start: Date, end: Date): TimeMarker[] {
  const markers: TimeMarker[] = [];
  const duration = start.getTime() - end.getTime();

  // Start from the most recent date (left) and go backwards to oldest (right)
  // Start with January or July of the start year
  const startMonth = start.getMonth() >= 6 ? 6 : 0; // July (6) or January (0)
  let current = new Date(start.getFullYear(), startMonth, 1);

  // Ensure we don't go before the end date
  const endTime = end.getTime();

  while (current.getTime() >= endTime) {
    const month = current.getMonth();
    const isJanuary = month === 0;
    const isJuly = month === 6;
    const position = ((start.getTime() - current.getTime()) / duration) * 100;

    // Format label: show full "YYYY/MM" for January, just month number for July
    const label = isJanuary
      ? `${current.getFullYear()}/${String(month + 1).padStart(2, "0")}`
      : String(month + 1);

    markers.push({
      date: new Date(current),
      label,
      isMajor: isJanuary,
      position,
    });

    // Move to previous marker (6 months back)
    if (month === 6) {
      // July -> January
      current.setMonth(0);
    } else {
      // January -> previous July
      current.setFullYear(current.getFullYear() - 1);
      current.setMonth(6);
    }
  }

  return markers;
}

/**
 * Calculate filter date range
 */
export function getFilterDateRange(
  filter: "all" | "1y" | "6m" | "3m",
  allJobs: TimelineJob[],
): DateRange {
  const now = new Date();

  switch (filter) {
    case "3m": {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return { start: now, end: threeMonthsAgo };
    }
    case "6m": {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return { start: now, end: sixMonthsAgo };
    }
    case "1y": {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return { start: now, end: oneYearAgo };
    }
    case "all":
    default:
      return calculateDateRange(allJobs);
  }
}
