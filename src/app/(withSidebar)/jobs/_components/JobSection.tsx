import type { Jobs } from "hiroppy/types";
import { Card, CardContent, CardTitle } from "../../../../components/Card";
import { DateRange } from "../../../../components/DateRange";
import { Image } from "../../../../components/Image";
import { Link } from "../../../../components/Link";
import { ExpandableArticleLinks } from "./ExpandableArticleLinks";
import { MarkdownContent } from "./MarkdownContent";
import { SectionSubheading } from "./SectionSubheading";

type Props = {
  title: "Main Job" | "My Company";
  items: Jobs["main"] | Jobs["side"];
  meta: Jobs["meta"];
};

export function JobSection({ title, items, meta }: Props) {
  const titleLabel = title === "Main Job" ? "main" : "side";
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
            const companyMeta = meta[company as keyof Jobs["meta"]] ?? null;

            return (
              <Card
                key={jobId}
                id={jobId}
                className="group scroll-mt-24 shadow-sm transform transition-transform duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-safe:hover:-translate-y-[2px]"
                ariaLabel={`${titleLabel}-${name}`}
              >
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-start">
                      <Image
                        src={companyMeta.image}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg bg-white p-1.5 shadow-sm transition-transform group-hover:scale-105"
                      />
                      <div>
                        <CardTitle className="mb-1 text-base">
                          <Link
                            href={companyMeta.url}
                            className="text-card-title font-semibold no-underline transition-opacity hover:no-underline hover:opacity-60"
                            ariaLabel={`${name}の会社サイトを開く`}
                          >
                            {name}
                          </Link>
                        </CardTitle>
                        <span className="border-badge-border block text-badge-text bg-badge-bg items-center rounded border px-2 py-0.5 text-xs font-medium w-fit">
                          {position}
                        </span>
                      </div>
                    </div>
                    <DateRange
                      start={new Date(start)}
                      end={end ? new Date(end) : null}
                      variant="text"
                      isActive={isCurrentJob}
                      className="hidden md:block"
                    />
                  </div>
                  <DateRange
                    start={new Date(start)}
                    end={end ? new Date(end) : null}
                    variant="text"
                    isActive={isCurrentJob}
                    className="md:hidden"
                  />

                  <div>
                    <MarkdownContent
                      markdown={description}
                      className="prose prose-sm text-card-text max-w-none text-sm"
                    />
                    <ExpandableArticleLinks
                      links={links ?? []}
                      companyName={name}
                    />
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
