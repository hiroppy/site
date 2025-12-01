import { notFound } from "next/navigation";
import { MdError, MdNewspaper } from "react-icons/md";
import { ARTICLE_TYPES, ArticleType } from "../_constant";
import { getContentData } from "../_utils/feedleData";
import { ArticleGrid } from "./ArticleGrid";
import { RSSFeedButtons } from "./RSSFeedButtons";
import { ServiceInfoHeader } from "./ServiceInfoHeader";

type Props = {
  type: string;
  category?: string;
  service?: string;
  period?: string;
};

export async function Content({ type, category, service, period }: Props) {
  // TODO:
  const pathSegments = [type, category, service].filter(Boolean) as string[];

  if (!ARTICLE_TYPES.includes(type as ArticleType)) {
    notFound();
  }

  const {
    currentType,
    currentCategory,
    currentService,
    articles,
    sources,
    error,
    serviceGroups,
    lastHarvested,
  } = await getContentData(pathSegments, period ?? "all");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        {currentService ? (
          <ServiceInfoHeader
            currentService={currentService}
            serviceGroups={serviceGroups}
            currentType={currentType}
            currentCategory={currentCategory}
            currentPeriod={period}
          />
        ) : (
          <RSSFeedButtons lastHarvested={lastHarvested} />
        )}
      </div>
      <div className="flex-1 scroll-smooth overflow-y-auto px-4 py-4 pt-6 md:px-6 md:py-6">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-600">
              <MdError className="h-5 w-5" />
              <span>Failed to load articles: {error}</span>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500">
            <MdNewspaper className="mx-auto mb-4 h-12 w-12" />
            <p className="mb-2 text-lg font-medium">No articles found</p>
          </div>
        ) : (
          <ArticleGrid articles={articles} sources={sources} />
        )}
      </div>
    </div>
  );
}
