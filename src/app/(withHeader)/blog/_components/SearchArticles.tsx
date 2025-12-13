"use client";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useEffect, useRef, useState } from "react";
import { SearchInputField } from "../../../../components/SearchInputField";
import { cn } from "../../../../utils/cn";
import { useAlgoliaSearch } from "../_hooks/useAlgoliaSearch";

type BlogHit = {
  title: string;
  path: string;
  objectID?: string;
};

const ALGOLIA_APPLICATION_ID = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID;
const ALGOLIA_SEARCH_ONLY_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY;

export function SearchArticles() {
  const [searchClient, setSearchClient] = useState<ReturnType<
    typeof algoliasearch
  > | null>(null);

  useEffect(() => {
    if (!ALGOLIA_APPLICATION_ID || !ALGOLIA_SEARCH_ONLY_KEY) {
      setSearchClient(null);
      return;
    }

    const client = algoliasearch(
      ALGOLIA_APPLICATION_ID,
      ALGOLIA_SEARCH_ONLY_KEY,
    );
    setSearchClient(client);
  }, []);

  if (!searchClient) {
    return (
      <SearchInputField
        id="search-placeholder"
        value=""
        placeholder="記事を検索..."
        disabled
      />
    );
  }

  return <SearchAutocomplete searchClient={searchClient} />;
}

function SearchAutocomplete({
  searchClient,
}: {
  searchClient: ReturnType<typeof algoliasearch>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    hits,
    inputValue,
    isSearching,
    shouldShowResults,
    hasHits,
    hasError,
    error,
    handleChange,
    handleFocus,
    handleClear,
    handleCompositionStart,
    handleCompositionEnd,
    hideResults,
  } = useAlgoliaSearch({ searchClient });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        hideResults();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [hideResults]);

  return (
    <div ref={containerRef} className="relative">
      <SearchInputField
        id="search-input"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onClear={handleClear}
        placeholder="記事を検索..."
        isSearching={isSearching}
      />
      <SearchResultsList
        hits={hits}
        shouldShowResults={shouldShowResults}
        hasHits={hasHits}
        hasError={hasError}
        error={error}
      />
    </div>
  );
}

type SearchResultsListProps = {
  hits: BlogHit[];
  shouldShowResults: boolean;
  hasHits: boolean;
  hasError: boolean;
  error: string | null;
};

function SearchResultsList({
  hits,
  shouldShowResults,
  hasHits,
  hasError,
  error,
}: SearchResultsListProps) {
  return (
    <div
      id="search-results"
      className={cn(
        "border-line absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border bg-white shadow-lg",
        !shouldShowResults && "hidden",
      )}
    >
      <ul className={cn("py-2", !hasHits && "hidden")}>
        {hits.map((hit) => {
          const key = hit.objectID ?? hit.path;
          const href =
            typeof window !== "undefined"
              ? new URL(hit.path, window.location.origin).href
              : hit.path;
          return (
            <li
              key={key}
              className="px-4 py-2 text-text-main transition-colors duration-200 hover:bg-surface"
            >
              <a
                className="block text-text-main transition-colors duration-200 hover:text-link"
                href={href}
              >
                {hit.title}
              </a>
            </li>
          );
        })}
      </ul>
      {hasError && (
        <div
          id="search-error"
          className="border-t-red-200 bg-red-50 text-red-800 border-t p-4 text-center"
        >
          {error}
        </div>
      )}
      {!hasError && (
        <div
          id="no-results"
          className={cn(
            "text-text-muted p-4 text-center",
            (!shouldShowResults || hasHits) && "hidden",
          )}
        >
          該当する記事が見つかりませんでした
        </div>
      )}
    </div>
  );
}
