import type { Metadata } from "next";
import jobsData from "hiroppy/data/jobs" assert { type: "json" };
import { marked } from "marked";
import { Icon } from "@iconify/react";
import { cn } from "@site/utils/cn";
import {
  calculateDateRange,
  calculateDurationMonths,
  calculatePosition,
  formatDuration,
  generateTimeMarkers,
} from "@site/utils/timelineCalculations";
import { Timeline } from "./Timeline";
import { formatPeriod, normalizeJobs, type JobEntry, type JobsJson } from "./lib";
import { skills } from "./skills";

const PAGE_TITLE = "Skills & Work Experience";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "Front-end, tooling, and leadership experience overview. This is the Next.js static export preview; Astro remains production until migration finishes.",
};

const introParagraphs = [
  "2008年頃からJavaScriptとCを使ってプログラミングを始め、4年間画像処理を研究し、ニコニコ生放送の動画最適化についても研究をしていました。",
  "現在は、主にwebpack、Turborepo、Viteなどのツールを使ったWebパフォーマンスとフロントエンドインフラストラクチャの構築が専門です。Next.jsとGraphQLを2017年から利用しており、様々な製品開発を行っています。",
];

type TimelineView = {
  key: "all" | "main" | "side";
  jobs: TimelineRenderJob[];
  height: number;
};

type TimelineSourceJob = {
  id: string;
  name: string;
  position: string;
  start: Date;
  end: Date | null;
  type: "main" | "side";
  logo?: string;
  url?: string;
  isActive: boolean;
};

type TimelineRenderJob = TimelineSourceJob & {
  durationLabel: string;
  startPercent: number;
  widthPercent: number;
  row: number;
};

const nowYear = new Date().getFullYear();

function processTitle(title: string) {
  const parts = title.split(" ");
  const hasMaintainer = parts.includes("👷");
  const cleanTitle = title.replace(" 👷", "");
  return { cleanTitle, hasMaintainer };
}

function SkillBox({
  title,
  colorClass,
  items,
}: {
  title: string;
  colorClass: string;
  items: { title: string; from: number; to?: number }[];
}) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-[#2a3d58] dark:bg-[#1f2f47]">
      <div className="mb-4 flex items-center space-x-3">
        <span className={cn("h-3 w-3 rounded-full", colorClass)} aria-hidden />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ title, from, to }) => {
          const endYear = to || nowYear;
          const years = endYear - from;
          const { cleanTitle, hasMaintainer } = processTitle(title);

          return (
            <article
              key={`${title}-${from}`}
              className="card-lift rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#2a3d58] dark:bg-[#1f2f47]"
            >
              <div className="space-y-2">
                <h4 className="flex items-center font-medium text-gray-900 dark:text-gray-100">
                  {cleanTitle}
                  {hasMaintainer ? <span className="ml-2">👷</span> : null}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-800 dark:bg-slate-700 dark:text-gray-200">
                    {from} - {to ?? "Present"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {years} year{years !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SkillSection() {
  return (
    <section className="space-y-8 mb-16">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Technical Skills</h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          {introParagraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <span role="img" aria-label="maintainer">
              👷
            </span>
            <span>maintainer(including past)</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {skills.map((category) => (
          <SkillBox key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}

function sortJobs(jobs: TimelineSourceJob[]) {
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
}

function buildTimelineData(mainJobs: JobEntry[], sideJobs: JobEntry[], meta: JobsJson["meta"]) {
  const allJobs = [...mainJobs, ...sideJobs].map((job) => ({
    id: job.id,
    name: job.name,
    position: job.position,
    start: job.start,
    end: job.end,
    type: job.role,
    logo: meta[job.company]?.image,
    url: meta[job.company]?.url,
    isActive: job.isActive,
  }));

  const dateRange = calculateDateRange(allJobs as any);
  const markers = generateTimeMarkers(dateRange.start, dateRange.end);
  const filters: Array<TimelineView["key"]> = ["all", "main", "side"];

  const views: TimelineView[] = filters.map((key) => {
    const filtered = key === "all" ? allJobs : allJobs.filter((job) => job.type === key);
    const sorted = sortJobs(filtered);

    const jobs = sorted.map((job, index) => {
      const { startPercent, widthPercent } = calculatePosition(job as any, dateRange.start, dateRange.end);
      const durationMonths = calculateDurationMonths(job.start, job.end);

      return {
        ...job,
        startPercent,
        widthPercent,
        durationLabel: formatDuration(durationMonths),
        row: index,
      };
    });

    return { key, jobs, height: jobs.length * 72 };
  });

  return { markers, views };
}

function resolveImagePath(image?: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
}

type ArticleLink = {
  title?: string;
  description?: string;
  image?: string;
  name?: string;
  url: string;
};

function ArticleLinks({ links, companyName }: { links: ArticleLink[]; companyName: string }) {
  const validLinks = links.filter((link) => link.title && link.description);
  if (!validLinks.length) return null;

  const uniqueId = `article-${companyName.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm font-medium text-gray-700 transition-colors select-none hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:newspaper-variant-outline" width={18} height={18} className="text-gray-500 dark:text-gray-400" />
            <span>関連記事 ({validLinks.length}件)</span>
          </div>
          <Icon
            icon="mdi:chevron-down"
            width={20}
            height={20}
            className="text-gray-400 transition-transform duration-200 group-open:rotate-180 dark:text-gray-500"
          />
        </summary>

        <div className="mt-3 overflow-hidden">
          <div
            id={uniqueId}
            className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {validLinks.map((link) => (
              <a
                key={`${link.url}-${link.title}`}
                href={link.url}
                className="group/card w-40 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                aria-label={link.title}
              >
                <div className="relative h-24 overflow-hidden bg-gray-100 dark:bg-slate-900">
                  {link.image ? (
                    <img
                      src={resolveImagePath(link.image)}
                      alt={link.title || "記事画像"}
                      className="h-full w-full object-cover transition duration-300 group-hover/card:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 dark:from-slate-800 dark:to-slate-700">
                      <Icon icon="mdi:newspaper-variant-outline" width={32} height={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                </div>

                <div className="p-2 space-y-1">
                  {link.name ? <div className="text-[10px] text-gray-500 dark:text-gray-400">{link.name}</div> : null}
                  <h5 className="line-clamp-2 text-xs font-semibold text-gray-900 transition-colors group-hover/card:text-blue-600 dark:text-gray-100 dark:group-hover/card:text-blue-300">
                    {link.title}
                  </h5>
                  <p className="line-clamp-2 text-[11px] leading-snug text-gray-600 dark:text-gray-300">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}

function JobCard({
  job,
  meta,
  index,
}: {
  job: JobEntry;
  meta: JobsJson["meta"];
  index: number;
}) {
  const html = job.description ? marked.parse(job.description) : "";
  const logo = meta[job.company]?.image ? resolveImagePath(meta[job.company]?.image) : "";
  const companyUrl = meta[job.company]?.url;
  const isCurrent = job.isActive;

  return (
    <article
      id={job.id}
      className="group card-lift scroll-mt-24 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#2a3d58] dark:bg-[#1f2f47]"
      aria-label={`${job.role}-${job.name}`}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          {logo ? (
            <div className="shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-2 shadow-sm transition-transform group-hover:scale-105 dark:bg-slate-900">
                <img src={logo} alt={job.name} className="h-12 w-12 rounded-md object-contain" />
              </div>
            </div>
          ) : null}

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <a
                    href={companyUrl}
                    className="text-lg font-semibold text-gray-900 transition-colors hover:text-blue-700 dark:text-gray-100 dark:hover:text-blue-300"
                    aria-label={`${job.name}の会社サイトを開く`}
                  >
                    {job.name}
                  </a>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        isCurrent
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200",
                      )}
                    >
                      {job.position}
                    </span>
                    {isCurrent ? (
                      <span className="flex items-center space-x-1 text-xs text-green-700 dark:text-green-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span>Current</span>
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {formatPeriod(job)} · {job.durationLabel}
                </div>
              </div>
            </div>

            {html ? (
              <div
                className="prose prose-sm max-w-none text-gray-700 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}

            <ArticleLinks links={job.links ?? []} companyName={`${job.role}-${index}`} />
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkExperienceSection({
  mainJobs,
  sideJobs,
  meta,
}: {
  mainJobs: JobEntry[];
  sideJobs: JobEntry[];
  meta: JobsJson["meta"];
}) {
  return (
    <section className="space-y-8 mb-16">
      <div className="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-gray-200 dark:lg:divide-[#2a3d58]">
        <div className="lg:pr-3 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Main Job</h3>
          <div className="space-y-6">
            {mainJobs.map((job, index) => (
              <JobCard key={job.id} job={job} meta={meta} index={index} />
            ))}
          </div>
        </div>
        <div className="lg:pl-3 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Company</h3>
          <div className="space-y-6">
            {sideJobs.map((job, index) => (
              <JobCard key={job.id} job={job} meta={meta} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function JobsPage() {
  const { main, side, meta } = jobsData as JobsJson;
  const mainJobs = normalizeJobs(main, "main", meta);
  const sideJobs = normalizeJobs(side, "side", meta);
  const timelineData = buildTimelineData(mainJobs, sideJobs, meta);

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <header className="py-6 text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{PAGE_TITLE}</h1>
      </header>

      <SkillSection />

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Work Experience</h2>
        <Timeline views={timelineData.views} markers={timelineData.markers} />
        <WorkExperienceSection mainJobs={mainJobs} sideJobs={sideJobs} meta={meta} />
      </section>
    </main>
  );
}
