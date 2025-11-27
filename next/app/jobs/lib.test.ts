import { describe, expect, it } from "vitest";
import { formatPeriod, normalizeJobs, type JobsJson } from "./lib";

const meta: JobsJson["meta"] = {
  acme: { url: "https://example.com/acme" },
  beta: { url: "https://beta.test/" },
};

describe("jobs lib", () => {
  it("normalizes jobs and preserves input order", () => {
    const main = [
      {
        name: "Acme",
        start: "2023-01-01",
        end: "2023-12-31",
        position: "Engineer",
        company: "acme",
      },
      {
        name: "Beta",
        start: "2024-02-01",
        end: null,
        position: "Lead",
        company: "beta",
      },
    ];

    const normalized = normalizeJobs(main, "main", meta);
    expect(normalized).toHaveLength(2);
    expect(normalized[0].name).toBe("Acme");
    expect(normalized[0].companyUrl).toBe("https://example.com/acme");
    expect(normalized[0].isActive).toBe(false);
    expect(normalized[0].id).toBe("main-0");
    expect(normalized[1].name).toBe("Beta");
    expect(normalized[1].durationLabel).toContain("年"); // formatDuration result
  });

  it("formats period with Present for ongoing roles", () => {
    const [job] = normalizeJobs(
      [
        {
          name: "Beta",
          start: "2024-02-01",
          end: null,
          position: "Lead",
          company: "beta",
        },
      ],
      "main",
      meta,
    );
    expect(formatPeriod(job)).toBe("2024 / 02 / 01 - Present");
  });
});
