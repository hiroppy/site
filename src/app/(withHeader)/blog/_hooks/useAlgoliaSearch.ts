import type { liteClient as algoliasearch } from "algoliasearch/lite";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
} from "react";

type BlogHit = {
  title: string;
  path: string;
  objectID?: string;
};

type UseAlgoliaSearchOptions = {
  searchClient: ReturnType<typeof algoliasearch>;
  hitsPerPage?: number;
};

export function useAlgoliaSearch({
  searchClient,
  hitsPerPage = 7,
}: UseAlgoliaSearchOptions) {
  const [hits, setHits] = useState<BlogHit[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  const trimmedQuery = inputValue.trim();
  const shouldShowResults = showResults && trimmedQuery.length > 0;
  const hasHits = hits.length > 0;
  const hasError = error !== null;

  // Reset on route change
  useEffect(() => {
    setHits([]);
    setInputValue("");
    setIsComposing(false);
    setShowResults(false);
    setIsSearching(false);
    setError(null);
    controllerRef.current?.abort();
  }, [pathname]);

  // Perform search
  useEffect(() => {
    if (isComposing) {
      return;
    }

    if (trimmedQuery.length === 0) {
      setHits([]);
      setIsSearching(false);
      setShowResults(false);
      setError(null);
      return;
    }

    controllerRef.current?.abort();
    const signal = new AbortController();
    controllerRef.current = signal;

    setIsSearching(true);
    setError(null);

    searchClient
      .search<BlogHit>({
        requests: [
          {
            indexName: "blog",
            query: trimmedQuery,
            hitsPerPage,
          },
        ],
      })
      .then(({ results }) => {
        if (signal.signal.aborted) return;
        const [result] = results;
        const hitsFromResult =
          result && "hits" in result ? (result.hits ?? []) : [];
        setHits(hitsFromResult as BlogHit[]);
        setShowResults(trimmedQuery.length > 0);
        setError(null);
      })
      .catch((error) => {
        if (signal.signal.aborted) return;
        console.error("Search error:", error);
        setHits([]);
        setError(
          error instanceof Error
            ? error.message
            : "検索中にエラーが発生しました",
        );
      })
      .finally(() => {
        if (signal.signal.aborted) return;
        setIsSearching(false);
      });

    return () => signal.abort();
  }, [isComposing, searchClient, trimmedQuery, hitsPerPage]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    setInputValue(nextValue);
  }, []);

  const handleFocus = useCallback(() => {
    if (trimmedQuery.length > 0) {
      setShowResults(true);
    }
  }, [trimmedQuery.length]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setHits([]);
    setShowResults(false);
    setError(null);
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      setIsComposing(false);
      const nextValue = event.currentTarget.value;
      setInputValue(nextValue);
      setShowResults(nextValue.trim().length > 0);
    },
    [],
  );

  const hideResults = useCallback(() => {
    setShowResults(false);
  }, []);

  return {
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
  };
}
