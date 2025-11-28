import {
  calculateDateRange,
  calculateDurationMonths,
  calculatePosition,
  formatDuration,
  generateTimeMarkers,
  type TimelineJob,
} from "./timelineCalculations";
import { afterEach, describe, expect, it, vi } from "vitest";

const buildJob = (overrides: Partial<TimelineJob> = {}): TimelineJob => ({
  id: "job-1",
  name: "Example",
  company: "ACME",
  position: "Engineer",
  start: new Date("2022-01-01T00:00:00Z"),
  end: new Date("2022-06-01T00:00:00Z"),
  type: "main",
  logo: "",
  url: "https://example.com",
  row: 0,
  startPercent: 0,
  widthPercent: 0,
  durationMonths: 0,
  isActive: false,
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("calculateDateRange", () => {
  it("uses the most recent date as start and oldest as end", () => {
    const now = new Date("2024-07-01T00:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const range = calculateDateRange([
      buildJob({
        id: "past",
        start: new Date("2018-01-01T00:00:00Z"),
        end: new Date("2020-01-01T00:00:00Z"),
      }),
      buildJob({
        id: "active",
        start: new Date("2023-05-01T00:00:00Z"),
        end: null,
      }),
    ]);

    expect(range.start.toISOString()).toBe(now.toISOString());
    expect(range.end.toISOString()).toBe("2018-01-01T00:00:00.000Z");
  });
});

describe("calculatePosition", () => {
  it("calculates start and width percentages against the timeline span", () => {
    const timelineStart = new Date("2020-01-10T00:00:00Z");
    const timelineEnd = new Date("2020-01-01T00:00:00Z");

    const { startPercent, widthPercent } = calculatePosition(
      buildJob({
        start: new Date("2020-01-04T00:00:00Z"),
        end: new Date("2020-01-07T00:00:00Z"),
      }),
      timelineStart,
      timelineEnd,
    );

    expect(startPercent).toBeCloseTo(33.333, 3);
    expect(widthPercent).toBeCloseTo(33.333, 3);
  });
});

describe("calculateDurationMonths", () => {
  it("counts whole months between two dates and clamps to at least one month", () => {
    expect(
      calculateDurationMonths(
        new Date("2023-01-15T00:00:00Z"),
        new Date("2024-03-14T00:00:00Z"),
      ),
    ).toBe(14);

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-02-01T00:00:00Z"));
    expect(
      calculateDurationMonths(new Date("2023-02-15T00:00:00Z"), null),
    ).toBe(1);
  });
});

describe("formatDuration", () => {
  it("formats durations in months into Japanese text", () => {
    expect(formatDuration(26)).toBe("2年2ヶ月");
    expect(formatDuration(12)).toBe("1年");
    expect(formatDuration(5)).toBe("5ヶ月");
  });
});

describe("generateTimeMarkers", () => {
  it("generates markers for January and July between the range", () => {
    const markers = generateTimeMarkers(
      new Date("2024-08-01T00:00:00Z"),
      new Date("2023-12-01T00:00:00Z"),
    );

    expect(markers).toHaveLength(2);
    expect(markers[0]).toMatchObject({
      label: "7",
      isMajor: false,
    });
    expect(markers[1]).toMatchObject({
      label: "2024/01",
      isMajor: true,
    });

    // Positions are normalized within the range, so they should land between 0–100.
    markers.forEach((marker) => {
      expect(marker.position).toBeGreaterThanOrEqual(0);
      expect(marker.position).toBeLessThanOrEqual(100);
    });
  });
});
