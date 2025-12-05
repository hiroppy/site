import articlesData from "hiroppy/generated/media.json";
import podcastsData from "hiroppy/generated/podcasts.json";
import talksData from "hiroppy/generated/talks.json";
import type { Media, Talk, Podcast } from "hiroppy/types";
import { sortByDate } from "../../../../_utils/sortItems";
import { Kind } from "../_constants";

type ALL = Media | Talk | Podcast;
export type ALL_WITH_CATEGORY = ALL & {
  category: string;
};

export async function getData(kind: Kind): Promise<ALL_WITH_CATEGORY[]> {
  "use cache";

  const talks = format(talksData as Talk[], "talks");
  const articles = format(articlesData as Media[], "articles");
  const podcasts = format(podcastsData as Podcast[], "podcasts");

  const dataMap = {
    all: sortByDate(
      [...talks, ...articles, ...podcasts],
      (item) => item.publishedAt,
    ),
    talks,
    articles,
    podcasts,
  };

  return dataMap[kind];
}

function format(data: ALL[], kind: Kind): ALL_WITH_CATEGORY[] {
  return data.map((item) => ({
    ...item,
    category: getCategoryLabel(kind),
  }));
}

function getCategoryLabel(type: Omit<Kind, "all">) {
  switch (type) {
    case "articles":
      return "Article";
    case "talks":
      return "Talk";
    case "podcasts":
      return "Podcast";
    default:
      return "";
  }
}
