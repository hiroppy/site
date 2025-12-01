import { useParams, useSearchParams } from "next/navigation";
import { ArticleKind, ArticleType } from "../_constant";

export function useCurrentCondition() {
  const params = useParams();
  const searchParams = useSearchParams();

  // TODO: fix type, get from an array
  const currentType = (params.type as ArticleType) || "all";
  const currentCategory = (params.category as ArticleKind) || "all";
  const currentService = (params.service as string) || undefined;
  const currentPeriod = searchParams.get("period") || "all";

  return { currentType, currentCategory, currentService, currentPeriod };
}
