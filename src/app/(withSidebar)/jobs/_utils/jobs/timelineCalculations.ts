type JobType = "main" | "side";

export type TimelineJob = {
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
};

export type DateRange = {
  start: Date;
  end: Date;
};

type TimeMarker = {
  date: Date;
  label: string;
  isMajor: boolean;
  position: number;
};

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
    startPercent: Number.parseFloat(
      ((endDiff / timelineDuration) * 100).toFixed(2),
    ),
    widthPercent: Number.parseFloat(
      ((jobDuration / timelineDuration) * 100).toFixed(2),
    ),
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
    const position = Number.parseFloat(
      (((start.getTime() - current.getTime()) / duration) * 100).toFixed(2),
    );

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
