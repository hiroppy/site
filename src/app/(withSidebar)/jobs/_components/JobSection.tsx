import type JobMeta from "hiroppy/generated/jobs.json";
import { Card } from "../../../_components/Card";
import { CardContent } from "../../../_components/CardContent";
import { CardTitle } from "../../../_components/CardTitle";
import { DateRange } from "../../../_components/DateRange";
import { Image } from "../../../_components/Image";
import { Link } from "../../../_components/Link";
import { ExpandableArticleLinks } from "./ExpandableArticleLinks";
import type { JobItemWithParsedDescription } from "./JobExperience";
import { MarkdownContent } from "./MarkdownContent";
import { SectionSubheading } from "./SectionSubheading";

type JobMetaData = (typeof JobMeta)["meta"];

type CompanyMeta = {
  image: string;
  url: string;
};

type Props = {
  title: "Main Job" | "My Company";
  items: JobItemWithParsedDescription[];
  meta: JobMetaData;
};

// Helper function to safely get company metadata
function getCompanyMeta(
  metadata: JobMetaData,
  companyKey: string,
): CompanyMeta | null {
  const companyMeta = metadata[companyKey as keyof JobMetaData];
  if (!companyMeta || typeof companyMeta !== "object") {
    return null;
  }
  return companyMeta as CompanyMeta;
}

export function JobSection({ title, items, meta }: Props) {
  const titleLabel = title === "Main Job" ? "main" : "coder-penguin";
  const history = items;

  return (
    <div className="space-y-6">
      <SectionSubheading>{title}</SectionSubheading>
      <div className="space-y-6">
        {history.map(
          (
            { name, company, description, start, end, position, links },
            index,
          ) => {
            const isCurrentJob = end === null;
            const jobType = title === "Main Job" ? "main" : "side";
            const jobId = `${jobType}-${index}`;
            const companyMeta = getCompanyMeta(meta, company);

            return (
              <Card
                key={jobId}
                id={jobId}
                className="group card-lift scroll-mt-24 shadow-sm"
                ariaLabel={`${titleLabel}-${name}`}
              >
                <CardContent>
                  {/* Mobile Layout */}
                  <div className="block space-y-4 md:hidden">
                    {/* Header: Image + Company + Position */}
                    <div className="flex items-start gap-3">
                      {companyMeta && (
                        <div className="shrink-0">
                          <Image
                            src={companyMeta.image}
                            alt=""
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg bg-white p-1.5 shadow-sm transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="mb-1 text-base">
                              {companyMeta ? (
                                <Link
                                  href={companyMeta.url}
                                  className="!text-card-title font-semibold no-underline transition-opacity hover:!no-underline hover:opacity-60"
                                  ariaLabel={`${name}の会社サイトを開く`}
                                >
                                  {name}
                                </Link>
                              ) : (
                                <span className="text-card-title font-semibold">
                                  {name}
                                </span>
                              )}
                            </CardTitle>
                            <span className="border-badge-border text-badge-text bg-badge-bg inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium">
                              {position}
                            </span>
                          </div>
                          <DateRange
                            start={new Date(start)}
                            end={end ? new Date(end) : null}
                            variant="text"
                            isActive={isCurrentJob}
                            className="shrink-0"
                          />
                        </div>
                      </div>
                    </div>
                    <MarkdownContent
                      markdown={description}
                      className="prose prose-sm text-card-text max-w-none text-sm"
                    />
                    <ExpandableArticleLinks links={links} companyName={name} />
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <div className="flex items-start gap-4">
                      {companyMeta && (
                        <div className="shrink-0">
                          <Image
                            src={companyMeta.image}
                            alt=""
                            width={60}
                            height={60}
                            className="h-16 w-16 rounded-lg bg-white p-2 shadow-sm transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">
                            {companyMeta ? (
                              <Link
                                href={companyMeta.url}
                                className="!text-card-title font-semibold no-underline transition-opacity hover:!no-underline hover:opacity-60"
                                ariaLabel={`${name}の会社サイトを開く`}
                              >
                                {name}
                              </Link>
                            ) : (
                              <span className="text-card-title font-semibold">
                                {name}
                              </span>
                            )}
                          </CardTitle>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="border-badge-border text-badge-text bg-badge-bg inline-flex items-center rounded border px-3 py-1 text-xs font-medium">
                                {position}
                              </span>
                            </div>
                            <DateRange
                              start={new Date(start)}
                              end={end ? new Date(end) : null}
                              variant="text"
                              isActive={isCurrentJob}
                              className="shrink-0"
                            />
                          </div>
                        </div>

                        <MarkdownContent
                          markdown={description}
                          className="prose prose-sm text-card-text max-w-none text-sm"
                        />

                        <ExpandableArticleLinks
                          links={links}
                          companyName={name}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>
    </div>
  );
}
