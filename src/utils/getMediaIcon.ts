export function getMediaIcon(
  type: "article" | "podcast" | "achievement" | "talk"
) {
  switch (type) {
    case "article":
      return "✏️";
    case "podcast":
      return "🎙";
    case "achievement":
      return "🎉";
    case "talk":
      return "👨‍🏫";
  }
}
