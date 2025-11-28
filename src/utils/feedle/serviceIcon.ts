import type { Source } from "./articlesApi";

type ServiceIconResult = {
  type: "url" | "icon";
  value: string;
};

export function getServiceIcon(
  source: Source & { icon?: string },
): ServiceIconResult {
  // カスタムファビコンがある場合は最優先
  if (
    source.favicon &&
    source.favicon !== null &&
    (source.favicon.startsWith("http") || source.favicon.startsWith("/"))
  ) {
    return { type: "url", value: source.favicon };
  }

  // カスタムアイコンがある場合
  if (source.icon && !source.icon.startsWith("http")) {
    return { type: "icon", value: source.icon };
  }

  // 種類別の専用アイコン（faviconがない場合のフォールバック）
  if (source.kind === "release") {
    return { type: "icon", value: "mdi:github" };
  }
  if (source.kind === "podcast") {
    return { type: "icon", value: "mdi:podcast" };
  }

  // デフォルト
  return { type: "icon", value: "mdi:web" };
}
