import { describe, expect, it } from "vitest";
import { getContactFormEndpoint } from "./contactFormConfig";

describe("getContactFormEndpoint", () => {
  it("uses NEXT_PUBLIC_CONTACT_FORM_ENDPOINT when it is set", () => {
    expect(
      getContactFormEndpoint({
        NEXT_PUBLIC_CONTACT_FORM_ENDPOINT: "https://example.com/form",
        NODE_ENV: "production",
      }),
    ).toBe("https://example.com/form");
  });

  it("falls back to the coder-penguin production endpoint", () => {
    expect(getContactFormEndpoint({ NODE_ENV: "production" })).toBe(
      "https://coder-penguin.com/form",
    );
  });

  it("falls back to the local worker endpoint outside production", () => {
    expect(getContactFormEndpoint({ NODE_ENV: "development" })).toBe(
      "http://localhost:8787",
    );
  });
});
