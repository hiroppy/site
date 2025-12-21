import { useParams, useSearchParams } from "next/navigation";
import {
  ARTICLE_KINDS,
  ARTICLE_TYPES,
  type ArticleKind,
  type ArticleType,
} from "../_constant";

export function useCurrentCondition() {
  const params = useParams();
  const searchParams = useSearchParams();

  const currentType = ARTICLE_TYPES.includes(params.type as ArticleType)
    ? (params.type as ArticleType)
    : ("all" as const);

  const currentCategory = ARTICLE_KINDS.includes(params.category as ArticleKind)
    ? (params.category as ArticleKind)
    : ("all" as const);

  const currentService = (params.service as string) || undefined;
  const currentPeriod = searchParams.get("period") || "all";

  return { currentType, currentCategory, currentService, currentPeriod };
}
