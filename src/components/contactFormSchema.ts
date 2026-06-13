import { z, type ZodError } from "zod";

export const contactFormContentOptions = ["技術相談", "開発支援依頼"] as const;

export const contactFormSchema = z.object({
  company: z.string().trim().min(1, "会社名を入力してください"),
  email: z
    .string()
    .trim()
    .min(1, "連絡先メールアドレスを入力してください")
    .email("不正なメールアドレスの形式です"),
  content: z
    .string()
    .trim()
    .refine(
      (value) =>
        contactFormContentOptions.includes(
          value as (typeof contactFormContentOptions)[number],
        ),
      "依頼の種類を選択してください",
    ),
  comment: z.string().trim().min(1, "依頼の内容を入力してください"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormFieldErrors = Partial<
  Record<keyof ContactFormData, string>
>;

export function getContactFormData(formData: FormData) {
  return contactFormSchema.safeParse({
    company: getFormDataString(formData, "company"),
    email: getFormDataString(formData, "email"),
    content: getFormDataString(formData, "content"),
    comment: getFormDataString(formData, "comment"),
  });
}

export function getContactFormFieldErrors(
  error: ZodError<ContactFormData>,
): ContactFormFieldErrors {
  const fieldErrors = z.flattenError(error).fieldErrors;

  return removeEmptyEntries({
    company: fieldErrors.company?.[0],
    email: fieldErrors.email?.[0],
    content: fieldErrors.content?.[0],
    comment: fieldErrors.comment?.[0],
  });
}

function getFormDataString(formData: FormData, key: keyof ContactFormData) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function removeEmptyEntries(
  errors: Record<keyof ContactFormData, string | undefined>,
) {
  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value),
  ) as ContactFormFieldErrors;
}
