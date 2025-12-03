import type { MediaType } from "./types";

export function getCategoryLabel(type: "media" | "talks" | "podcasts"): string {
  switch (type) {
    case "media":
      return "Article";
    case "talks":
      return "Talk";
    case "podcasts":
      return "Podcast";
  }
}

export function getMediaIcon(type: "media" | "talks" | "podcasts"): string {
  switch (type) {
    case "media":
      return "mdi:typewriter";
    case "podcasts":
      return "mdi:podcast";
    case "talks":
      return "mdi:presentation";
    default:
      return "mdi:help-circle";
  }
}

export function getPrefixForTitle(
  type: "media" | "talks" | "podcasts",
): string {
  switch (type) {
    case "media":
      return "Posted";
    case "podcasts":
    case "talks":
      return "Talked";
    default:
      return "Unknown";
  }
}

export function getKindLabel(kind: MediaType | undefined): string {
  switch (kind) {
    case undefined:
      return "All";
    case "articles":
      return "Article";
    case "talks":
      return "Talk";
    case "podcasts":
      return "Podcast";
    default:
      return kind;
  }
}

export function getKindDescription(kind: MediaType | undefined): string {
  switch (kind) {
    case undefined:
      return "登壇・プレス・ポッドキャストなどのメディア活動";
    case "articles":
      return "プレス記事・外部寄稿などの記事活動";
    case "talks":
      return "カンファレンスやイベントでの登壇活動";
    case "podcasts":
      return "ポッドキャストへの出演活動";
    default:
      return "";
  }
}

export function getKindPath(kind: MediaType | undefined): string {
  return kind ? `/media/${kind}` : "/media";
}
