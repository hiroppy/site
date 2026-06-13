import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  getContactFormFieldErrors,
} from "./contactFormSchema";

describe("contactFormSchema", () => {
  it("accepts a valid coder-penguin contact payload", () => {
    const result = contactFormSchema.safeParse({
      email: "contact@example.com",
      company: "Example Inc.",
      content: "技術相談",
      comment: "Next.js のパフォーマンス改善について相談したいです。",
    });

    expect(result.success).toBe(true);
  });

  it("returns field errors for invalid contact payloads", () => {
    const result = contactFormSchema.safeParse({
      email: "not-an-email",
      company: "",
      content: "",
      comment: "",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(getContactFormFieldErrors(result.error)).toEqual({
      email: "不正なメールアドレスの形式です",
      company: "会社名を入力してください",
      content: "依頼の種類を選択してください",
      comment: "依頼の内容を入力してください",
    });
  });

  it("rejects contact types outside consulting and development support", () => {
    const result = contactFormSchema.safeParse({
      email: "contact@example.com",
      company: "Example Inc.",
      content: "技術顧問依頼",
      comment: "Next.js のパフォーマンス改善について相談したいです。",
    });

    expect(result.success).toBe(false);
  });
});
