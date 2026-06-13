import type { FormEventHandler } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import {
  type ContactFormFieldErrors,
  contactFormContentOptions,
} from "./contactFormSchema";

export type ContactFormStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "sales";

type Props = {
  idPrefix: string;
  status: ContactFormStatus;
  fieldErrors: ContactFormFieldErrors;
  selectedContent: string;
  canSubmit: boolean;
  onContentChange: (value: string) => void;
  onFieldChange: FormEventHandler<HTMLFormElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function ContactForm({
  idPrefix,
  status,
  fieldErrors,
  selectedContent,
  canSubmit,
  onContentChange,
  onFieldChange,
  onSubmit,
}: Props) {
  const isSubmitting = status === "submitting";
  const companyId = `${idPrefix}-contact-company`;
  const companyErrorId = `${companyId}-error`;
  const emailId = `${idPrefix}-contact-email`;
  const emailErrorId = `${emailId}-error`;
  const contentErrorId = `${idPrefix}-contact-content-error`;
  const commentId = `${idPrefix}-contact-comment`;
  const commentErrorId = `${commentId}-error`;

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onChange={onFieldChange}
      onSubmit={onSubmit}
    >
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
          aria-invalid={Boolean(fieldErrors.company)}
          aria-describedby={fieldErrors.company ? companyErrorId : undefined}
        />
        <FieldError id={companyErrorId} message={fieldErrors.company} />
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
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? emailErrorId : undefined}
        />
        <FieldError id={emailErrorId} message={fieldErrors.email} />
      </div>

      <fieldset
        className="flex flex-col gap-3"
        aria-describedby={fieldErrors.content ? contentErrorId : undefined}
      >
        <legend className="mb-3 font-semibold">
          依頼の種類 <RequiredMark />
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {contactFormContentOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                name="content"
                type="radio"
                value={option}
                required
                checked={selectedContent === option}
                onChange={(event) => onContentChange(event.target.value)}
                aria-invalid={Boolean(fieldErrors.content)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <FieldError id={contentErrorId} message={fieldErrors.content} />
      </fieldset>

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
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={fieldErrors.comment ? commentErrorId : undefined}
        />
        <FieldError id={commentErrorId} message={fieldErrors.comment} />
      </div>

      <StatusMessage status={status} />

      <Button
        type="submit"
        disabled={isSubmitting || !canSubmit}
        className="mt-1"
      >
        {isSubmitting ? "送信中..." : "送信"}
      </Button>
    </form>
  );
}

function RequiredMark() {
  return <span className="text-red-600">*</span>;
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message: string | undefined;
}) {
  if (!message) return null;

  return (
    <p id={id} className="text-sm text-red-700">
      {message}
    </p>
  );
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
