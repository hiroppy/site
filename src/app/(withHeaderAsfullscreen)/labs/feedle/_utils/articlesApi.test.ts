import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type Article,
  type Source,
  createServiceGroups,
  filterArticlesByPeriod,
  getServiceGroups,
} from "./articlesApi";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

const buildArticle = (id: string, publishedAt?: string): Article => ({
  id,
  title: id,
  published_at: publishedAt,
  hatena_bookmark_count: 0,
  harvested_at: "2024-05-01T00:00:00.000Z",
});

const buildSource = (id: string, kind: Source["kind"], count = 0): Source => ({
  id,
  name: id,
  type: "blog",
  url: `https://example.com/${id}`,
  enabled: true,
  kind,
  website: `https://example.com/${id}`,
  tags: [],
  count,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("filterArticlesByPeriod", () => {
  it("filters today's articles using JST day boundaries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-04-30T15:30:00.000Z"));

    const articles = [
      buildArticle("before-today", "2024-04-30T14:59:59.999Z"),
      buildArticle("today-start", "2024-04-30T15:00:00.000Z"),
      buildArticle("today-middle", "2024-05-01T03:00:00.000Z"),
      buildArticle("tomorrow-start", "2024-05-01T15:00:00.000Z"),
      buildArticle("missing-published-at"),
    ];

    expect(
      filterArticlesByPeriod(articles, "today").map(({ id }) => id),
    ).toEqual(["today-start", "today-middle"]);
  });

  it("filters month articles from the JST day start 30 days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-04-30T15:30:00.000Z"));

    const articles = [
      buildArticle("before-window", "2024-03-31T14:59:59.999Z"),
      buildArticle("window-start", "2024-03-31T15:00:00.000Z"),
      buildArticle("recent", "2024-04-15T00:00:00.000Z"),
      buildArticle("missing-published-at"),
    ];

    expect(
      filterArticlesByPeriod(articles, "month").map(({ id }) => id),
    ).toEqual(["window-start", "recent"]);
  });

  it("returns all articles for the all period", () => {
    const articles = [
      buildArticle("published", "2024-05-01T00:00:00.000Z"),
      buildArticle("missing-published-at"),
    ];

    expect(filterArticlesByPeriod(articles, "all")).toBe(articles);
  });
});

describe("service groups", () => {
  it("groups sources by service name and totals article counts", () => {
    expect(
      createServiceGroups([
        buildSource("React", "official", 3),
        buildSource("React", "community", 2),
        buildSource("Next", "release", 5),
      ]),
    ).toEqual({
      React: {
        sources: [
          buildSource("React", "official", 3),
          buildSource("React", "community", 2),
        ],
        articleCount: 5,
      },
      Next: {
        sources: [buildSource("Next", "release", 5)],
        articleCount: 5,
      },
    });
  });

  it("filters service groups by category before grouping", () => {
    expect(
      Object.keys(
        getServiceGroups("official", [
          buildSource("React", "official"),
          buildSource("Next", "release"),
        ]),
      ),
    ).toEqual(["React"]);
  });
});
