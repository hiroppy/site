import articlesData from "hiroppy/generated/media.json";
import podcastsData from "hiroppy/generated/podcasts.json";
import talksData from "hiroppy/generated/talks.json";
import { BLOG_URL } from "../../../_utils/constants";
import { getCategoryLabel, getMediaIcon, getPrefixForTitle } from "./labels";
import type { DataItem, MediaItem, MediaType } from "./types";

function getDataKind(kind: MediaType): "media" | "talks" | "podcasts" {
  return kind === "articles" ? "media" : kind;
}

export function getData(kind: MediaType): DataItem[] {
  const dataKind = getDataKind(kind);
  const dataMap = {
    talks: talksData,
    media: articlesData,
    podcasts: podcastsData,
  };

  const data = dataMap[dataKind];

  const res = (data as MediaItem[]).map((item) => ({
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    category: getCategoryLabel(dataKind),
    icon: getMediaIcon(dataKind),
    prefixForTitle: getPrefixForTitle(dataKind),
    siteUrl: item.siteUrl,
  }));

  if (dataKind === "media") {
    return res.filter(({ siteUrl }) => {
      return !(
        siteUrl?.startsWith(process.env.NEXT_PUBLIC_SITE || "") ||
        siteUrl?.startsWith(BLOG_URL)
      );
    });
  }

  return res;
}
