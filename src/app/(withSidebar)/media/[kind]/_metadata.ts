import { MEDIA_KINDS, MediaKind } from "../../../../constants";

export const title = "Media & Activities";

export function getMetadata(kind: MediaKind) {
  switch (kind) {
    case "all":
      return {
        path: "/media/all",
        title,
        description: "登壇・プレス・ポッドキャストなどのメディア活動",
      };
    case "articles":
      return {
        path: "/media/articles",
        title: `${title} / Articles`,
        description: "プレス記事・外部寄稿などの記事活動",
      };
    case "talks":
      return {
        path: "/media/talks",
        title: `${title} / Talks`,
        description: "カンファレンスやイベントでの登壇活動",
      };
    case "podcasts":
      return {
        path: "/media/podcasts",
        title: `${title} / Podcasts`,
        description: "ポッドキャストへの出演活動",
      };
  }
}

export function getStaticParams() {
  return MEDIA_KINDS.map((kind) => ({ kind }));
}
