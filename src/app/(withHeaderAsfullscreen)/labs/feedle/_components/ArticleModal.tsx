"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../../../../_components/Icon";
import { Link } from "../../../../_components/Link";
import { ARTICLE_PREVIEW_EVENT } from "../_utils/feedle/subscriptionStore";
import { Dialog, type DialogHandle } from "./Dialog";

type ArticlePreviewPayload = {
  title: string;
  summary?: string;
  description?: string;
  url?: string;
  image?: string;
  sourceName: string;
  published?: string;
  tags?: string[];
};

function formatDate(published?: string) {
  if (!published) return "";
  return new Date(published)
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
}

export function ArticleModal() {
  const [article, setArticle] = useState<ArticlePreviewPayload | null>(null);
  const dialogRef = useRef<DialogHandle>(null);

  useEffect(() => {
    const handlePreview = (event: Event) => {
      const customEvent = event as CustomEvent<ArticlePreviewPayload>;
      setArticle(customEvent.detail);
      dialogRef.current?.showModal();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(ARTICLE_PREVIEW_EVENT, handlePreview);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(ARTICLE_PREVIEW_EVENT, handlePreview);
      }
    };
  }, []);

  const closeModal = () => {
    dialogRef.current?.close();
    setArticle(null);
  };

  const summaryText =
    article?.summary || article?.description || "No summary available";

  return (
    <Dialog
      id="article-modal"
      title={article?.title ?? ""}
      dynamicTitle
      titleId="modal-title"
      closeButtonId="close-modal"
      maxWidth="max-w-4xl"
      backdrop="blur"
      position="auto"
      headerClass="sticky top-0 bg-white p-6"
      contentClass="max-h-[calc(90vh-120px)] overflow-y-auto p-6"
      ref={dialogRef}
      onClose={closeModal}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {article?.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <Icon
                  icon="mdi:image-outline"
                  className="mx-auto mb-2 h-8 w-8 text-gray-400"
                />
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
              {article?.sourceName}
            </span>
            <time className="text-xs">{formatDate(article?.published)}</time>
          </div>

          {article?.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Summary</h3>
            <p className="leading-relaxed whitespace-pre-wrap text-gray-600">
              {summaryText}
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href={article?.url || "#"}
              isBlank={true}
              unstyled
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Icon icon="mdi:open-in-new" className="mr-2 h-4 w-4" />
              Read full article
            </Link>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
