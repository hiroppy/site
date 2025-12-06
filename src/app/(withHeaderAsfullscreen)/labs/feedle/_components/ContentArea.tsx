import { Icon } from "../../../../_components/Icon";
import type { Article, Source } from "../_utils/feedle/articlesApi";
import { ArticleGrid } from "./ArticleGrid";

type Props = {
  error?: string | null;
  articles: Article[];
  sources: Source[];
};

export function ContentArea({ error, articles, sources }: Props) {
  return (
    <div className="flex-1 scroll-smooth px-4 py-4 pt-6 md:px-6 md:py-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="mdi:alert-circle" className="h-5 w-5" />
            <span>Failed to load articles: {error}</span>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-gray-500">
          <Icon
            icon="mdi:newspaper-variant-outline"
            className="mx-auto mb-4 h-12 w-12"
          />
          <p className="mb-2 text-lg font-medium">No articles found</p>
        </div>
      ) : (
        <ArticleGrid articles={articles} sources={sources} />
      )}
    </div>
  );
}
