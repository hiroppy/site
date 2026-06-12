import type { FormEventHandler } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";

export type ContactFormStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "sales";

type Props = {
  idPrefix: string;
  status: ContactFormStatus;
  selectedContent: string;
  onContentChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const contentOptions = [
  "技術顧問依頼",
  "開発支援依頼",
  "技術相談",
  "登壇・執筆依頼",
  "その他",
] as const;

export function ContactForm({
  idPrefix,
  status,
  selectedContent,
  onContentChange,
  onSubmit,
}: Props) {
  const isSubmitting = status === "submitting";
  const companyId = `${idPrefix}-contact-company`;
  const emailId = `${idPrefix}-contact-email`;
  const commentId = `${idPrefix}-contact-comment`;

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor={companyId} className="font-semibold">
          会社名 <RequiredMark />
        </label>
        <input
          id={companyId}
          name="company"
          type="text"
          required
          autoComplete="organization"
          data-1p-ignore
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="font-semibold">
          連絡先メールアドレス <RequiredMark />
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          data-1p-ignore
          className={inputClassName}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">
          依頼の種類 <RequiredMark />
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {contentOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                name="content"
                type="radio"
                value={option}
                required
                checked={selectedContent === option}
                onChange={(event) => onContentChange(event.target.value)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {selectedContent === "その他" && (
        <p className="text-sm text-red-700">
          営業のお問い合わせは固くお断りしております。
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={commentId} className="font-semibold">
          依頼の内容 <RequiredMark />
        </label>
        <textarea
          id={commentId}
          name="comment"
          required
          rows={5}
          data-1p-ignore
          className={cn(inputClassName, "min-h-32 resize-y")}
        />
      </div>

      <StatusMessage status={status} />

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "送信中..." : "送信"}
      </Button>
    </form>
  );
}

function RequiredMark() {
  return <span className="text-red-600">*</span>;
}

function StatusMessage({ status }: { status: ContactFormStatus }) {
  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
      >
        お問い合わせが送信されました。確認後、hello@hiroppy.me から返信します。
      </p>
    );
  }

  if (status === "sales") {
    return (
      <p
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      >
        営業のお問い合わせと判断されたため送信できませんでした。
      </p>
    );
  }

  if (status === "error") {
    return (
      <p
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      >
        送信に失敗しました。時間をおいて再度お試しください。
      </p>
    );
  }

  if (status === "submitting") {
    return (
      <p role="status" className="text-text-sub text-sm">
        送信中...
      </p>
    );
  }

  return null;
}

const inputClassName =
  "border-line bg-surface focus:ring-link w-full rounded-md border px-4 py-3 text-base focus:ring-2 focus:outline-none";
