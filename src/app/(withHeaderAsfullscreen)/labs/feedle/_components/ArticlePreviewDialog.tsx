"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import { Dialog, type DialogHandle } from "../../../../../components/Dialog";
import { formatDateJapanese } from "../../../../../utils/formatDate";

const ARTICLE_PREVIEW_EVENT = "feedle:article-preview";

export type ArticlePreviewPayload = {
  title: string;
  summary?: string;
  description?: string;
  url?: string;
  image?: string;
  sourceName: string;
  published?: string;
  tags?: string[];
};

export function ArticlePreviewDialog() {
  const [preview, setPreview] = useState<ArticlePreviewPayload | null>(null);
  const dialogRef = useRef<DialogHandle>(null);

  useEffect(() => {
    const handlePreview = (event: Event) => {
      const customEvent = event as CustomEvent<ArticlePreviewPayload>;
      const payload = customEvent.detail;
      if (!payload) return;
      setPreview(payload);
      try {
        dialogRef.current?.showModal();
      } catch {
        // ignore if already open
      }
    };

    window.addEventListener(ARTICLE_PREVIEW_EVENT, handlePreview);

    return () => {
      window.removeEventListener(ARTICLE_PREVIEW_EVENT, handlePreview);
    };
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const createXPostUrl = () => {
    if (!preview?.title || !preview?.url) return null;

    const text = preview.title;
    const url = preview.url;

    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  };

  const handleXPost = () => {
    const url = createXPostUrl();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const formattedPublished = useMemo(
    () => preview?.published && formatDateJapanese(preview.published, "long"),
    [preview?.published],
  );

  const shouldShowDescription =
    !!preview?.description && preview.description !== preview.summary;

  return (
    <Dialog
      id="article-preview-dialog"
      title={preview?.title || "Article Preview"}
      maxWidth="max-w-3xl"
      contentClass="space-y-4 p-6 text-sm text-gray-700"
      dialogClass="w-full max-w-3xl"
      onClose={() => setPreview(null)}
      ref={dialogRef}
    >
      <div className="space-y-4">
        <div className="flex justify-between text-xs font-medium uppercase tracking-wide text-gray-500">
          <span>{preview?.sourceName}</span>
          {formattedPublished && <time>{formattedPublished}</time>}
        </div>
        {preview?.summary && (
          <pre className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
            {preview.summary}
          </pre>
        )}
        {shouldShowDescription && (
          <p className="text-sm leading-relaxed text-gray-600">
            {preview.description}
          </p>
        )}
        {preview?.tags && preview.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preview.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            onClick={handleClose}
          >
            Close
          </button>
          {preview?.url && preview?.title && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-black px-3 py-1 text-sm font-medium text-white transition hover:bg-gray-800"
              onClick={handleXPost}
            >
              Post to
              <FaXTwitter className="h-4 w-4" />
            </button>
          )}
          {preview?.url && (
            <a
              href={preview.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1 text-sm font-medium text-white transition hover:bg-accent/90"
              onClick={handleClose}
            >
              Open article
              <MdOpenInNew className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </Dialog>
  );
}
