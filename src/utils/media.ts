import articlesData from "hiroppy/generated/media.json";
import podcastsData from "hiroppy/generated/podcasts.json";
import talksData from "hiroppy/generated/talks.json";
import type { Media, Talk, Podcast } from "hiroppy/types";
import { notFound } from "next/navigation";
import { BLOG_SITE_TITLE, MEDIA_KINDS, MediaKind } from "../constants";
import { getBlogPosts } from "../mdx/contentLoader";
import { sortByDate } from "./sortItems";

type ALL = Media | Talk | Podcast;
type ALL_WITH_CATEGORY = ALL & {
  category: string;
};

export async function getData(
  kind: MediaKind,
  options?: { includeBlog?: boolean },
): Promise<ALL_WITH_CATEGORY[]> {
  "use cache";

  const talks = format(talksData as Talk[], "talks");
  const articles = format(articlesData as Media[], "articles");
  const podcasts = format(podcastsData as Podcast[], "podcasts");

  let allData = [...talks, ...articles, ...podcasts];

  if (options?.includeBlog) {
    const blogPosts = await getBlogPosts();
    const formattedBlogs = blogPosts.map(
      ({ id, frontmatter }) =>
        ({
          title: frontmatter.title,
          url: `/blog/posts/${id}`,
          publishedAt: frontmatter.date.toISOString().split("T")[0],
          name: BLOG_SITE_TITLE,
          favicon: "/favicon.ico",
          category: "Blog",
        }) as ALL_WITH_CATEGORY,
    );
    allData = [...allData, ...formattedBlogs];
  }

  const dataMap = {
    all: sortByDate(allData, (item) => item.publishedAt),
    talks,
    articles,
    podcasts,
  };

  return dataMap[kind];
}

function format(data: ALL[], kind: MediaKind): ALL_WITH_CATEGORY[] {
  return data.map((item) => ({
    ...item,
    category: getCategoryLabel(kind),
  }));
}

function getCategoryLabel(type: Omit<MediaKind, "all">) {
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

export function getKind(kind: string) {
  if (!MEDIA_KINDS.includes(kind as MediaKind)) {
    notFound();
  }

  return kind as MediaKind;
}
