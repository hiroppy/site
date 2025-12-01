"use client";

import { useState } from "react";
import { MdRssFeed } from "react-icons/md";
import { SITE_URL } from "../../../../../constants";
import { ArticleKind } from "../_constant";
import { useCurrentCondition } from "../_hooks/useCurrentCondition";

const kinds = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "community", label: "Community" },
  { key: "release", label: "Release" },
  { key: "podcast", label: "Podcast" },
] satisfies { key: ArticleKind; label: string }[];

type Props = {
  lastHarvested?: Date;
};

export function RSSFeedButtons({ lastHarvested }: Props) {
  const { currentType } = useCurrentCondition();
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = async (url: string, label: string) => {
    await navigator.clipboard.writeText(url);

    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1000);
  };

  return (
    <div className="hidden shrink-0 border-b border-gray-200 bg-white px-6 py-3 md:flex">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <MdRssFeed className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-gray-900">RSS Feeds:</span>
          <div className="flex flex-wrap gap-2">
            {kinds.map((kind) => (
              <button
                key={kind.key}
                type="button"
                className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-all duration-150 hover:bg-gray-200 active:scale-95 active:bg-gray-300"
                onClick={() => {
                  const baseUrl = `${SITE_URL}/labs/feedle/${currentType}/rss.xml`;
                  const rssUrl =
                    kind.key !== "all"
                      ? `${baseUrl}?kind=${kind.key}`
                      : baseUrl;

                  handleCopy(rssUrl, kind.label);
                }}
              >
                {copiedLabel === kind.label ? "Copied!" : kind.label}
              </button>
            ))}
          </div>
        </div>
        {lastHarvested && (
          <p className="text-sm text-gray-600">
            Last updated:{" "}
            {lastHarvested.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
