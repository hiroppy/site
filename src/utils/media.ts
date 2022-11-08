import type { MediaType } from "../constants";

export function getMediaIcon(type: MediaType) {
  switch (type) {
    case "article":
      return "✏️";
    case "podcast":
      return "🎙";
    case "achievement":
      return "🎉";
    case "talk":
      return "👨‍🏫";
    default:
      return "😵‍💫";
  }
}

export function getPrefixForTitle(type: MediaType) {
  switch (type) {
    case "article":
      return "Posted";
    case "podcast":
    case "talk":
      return "Talked";
    case "achievement":
      return "Achieved";
    default:
      return "😵‍💫";
  }
}
