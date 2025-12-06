import { Kind, TITLE } from "../_constants";

export function getMetadata(kind: Kind) {
  switch (kind) {
    case "all":
      return {
        path: "/media/all",
        title: TITLE,
        description: "登壇・プレス・ポッドキャストなどのメディア活動",
      };
    case "articles":
      return {
        path: "/media/articles",
        title: `${TITLE} / Articles`,
        description: "プレス記事・外部寄稿などの記事活動",
      };
    case "talks":
      return {
        path: "/media/talks",
        title: `${TITLE} / Talks`,
        description: "カンファレンスやイベントでの登壇活動",
      };
    case "podcasts":
      return {
        path: "/media/podcasts",
        title: `${TITLE} / Podcasts`,
        description: "ポッドキャストへの出演活動",
      };
  }
}
