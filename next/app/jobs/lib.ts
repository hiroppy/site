import {
  calculateDurationMonths,
  formatDuration,
} from "@site/utils/timelineCalculations";

export type RawJob = {
  name: string;
  start: string;
  end: string | null;
  position: string;
  company: string;
  description?: string;
  links?: {
    title?: string;
    url: string;
    description?: string;
    image?: string;
    name?: string;
  }[];
};

export type JobsJson = {
  main: RawJob[];
  side: RawJob[];
  meta: Record<string, { image?: string; url?: string }>;
};

export type JobEntry = {
  id: string;
  name: string;
  company: string;
  position: string;
  start: Date;
  end: Date | null;
  durationLabel: string;
  companyUrl?: string;
  description?: string;
  links?: {
    title?: string;
    url: string;
    description?: string;
    image?: string;
    name?: string;
  }[];
  isActive: boolean;
  role: "main" | "side";
  order: number;
};

export function normalizeJobs(
  list: RawJob[],
  role: JobEntry["role"],
  meta: JobsJson["meta"],
): JobEntry[] {
  return [...list].map((job, index) => {
    const start = new Date(job.start);
    const end = job.end ? new Date(job.end) : null;
    const durationMonths = calculateDurationMonths(start, end);

    return {
      id: `${role}-${index}`,
      name: job.name,
      company: job.company,
      position: job.position,
      start,
      end,
      durationLabel: formatDuration(durationMonths),
      companyUrl: meta[job.company]?.url,
      description: job.description,
      links: job.links,
      isActive: end === null,
      role,
      order: index,
    };
  });
}

export function formatPeriod(job: JobEntry) {
  const start = `${job.start.getFullYear()} / ${String(job.start.getMonth() + 1).padStart(2, "0")} / ${String(job.start.getDate()).padStart(2, "0")}`;
  const end =
    job.end === null
      ? "Present"
      : `${job.end.getFullYear()} / ${String(job.end.getMonth() + 1).padStart(2, "0")} / ${String(job.end.getDate()).padStart(2, "0")}`;
  return `${start} - ${end}`;
}
