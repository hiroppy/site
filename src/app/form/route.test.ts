import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const originalContactFormEndpoint = process.env.CONTACT_FORM_ENDPOINT;
const originalPublicContactFormEndpoint =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

describe("POST /form", () => {
  afterEach(() => {
    restoreEnv("CONTACT_FORM_ENDPOINT", originalContactFormEndpoint);
    restoreEnv(
      "NEXT_PUBLIC_CONTACT_FORM_ENDPOINT",
      originalPublicContactFormEndpoint,
    );
    vi.unstubAllGlobals();
  });

  it("forwards contact form data to the configured endpoint", async () => {
    process.env.CONTACT_FORM_ENDPOINT = "https://example.com/form";
    const fetchMock = vi.fn().mockResolvedValue(new Response("OK"));
    vi.stubGlobal("fetch", fetchMock);

    const formData = createContactFormData();
    const response = await POST(
      new Request("http://localhost/form", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/form",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );
    const forwardedFormData = fetchMock.mock.calls[0]?.[1]?.body as FormData;
    expect(forwardedFormData.get("email")).toBe("contact@example.com");
    expect(forwardedFormData.get("company")).toBe("Example Inc.");
    expect(forwardedFormData.get("content")).toBe("技術相談");
    expect(forwardedFormData.get("comment")).toBe(
      "Next.js のパフォーマンス改善について相談したいです。",
    );
  });

  it("preserves rejection status from the contact endpoint", async () => {
    process.env.CONTACT_FORM_ENDPOINT = "https://example.com/form";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Bad Request", { status: 400 })),
    );

    const response = await POST(
      new Request("http://localhost/form", {
        method: "POST",
        body: createContactFormData(),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ ok: false });
  });

  it("returns bad gateway when forwarding fails", async () => {
    process.env.CONTACT_FORM_ENDPOINT = "https://example.com/form";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const response = await POST(
      new Request("http://localhost/form", {
        method: "POST",
        body: createContactFormData(),
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ ok: false });
  });
});

function createContactFormData() {
  const formData = new FormData();

  formData.append("email", "contact@example.com");
  formData.append("company", "Example Inc.");
  formData.append("content", "技術相談");
  formData.append(
    "comment",
    "Next.js のパフォーマンス改善について相談したいです。",
  );

  return formData;
}

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
