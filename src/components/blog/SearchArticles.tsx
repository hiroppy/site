import { useEffect, useRef, useState } from "preact/hooks";
import { Icon } from "../Icon";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js/es";
import { connectAutocomplete } from "instantsearch.js/es/connectors";
import type { AutocompleteRenderState } from "instantsearch.js/es/connectors/autocomplete/connectAutocomplete";
import type { Hit } from "instantsearch.js/es";
import { cn } from "../../utils/cn";

type BlogHit = Hit<{
  title: string;
  path: string;
}>;

const ALGOLIA_APPLICATION_ID = import.meta.env.PUBLIC_ALGOLIA_APPLICATION_ID;
const ALGOLIA_SEARCH_ONLY_KEY = import.meta.env.PUBLIC_ALGOLIA_SEARCH_ONLY_KEY;

if (!ALGOLIA_APPLICATION_ID || !ALGOLIA_SEARCH_ONLY_KEY) {
  throw new Error(
    "ALGOLIA_APPLICATION_ID and ALGOLIA_SEARCH_ONLY_KEY are required",
  );
}

export function SearchArticles() {
  const [showResults, setShowResults] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const searchInstanceRef = useRef<any>(null);

  useEffect(() => {
    const input = inputRef.current;
    const ul = ulRef.current;
    const searchResults = resultsRef.current;

    if (!input || !ul || !searchResults) {
      return;
    }

    try {
      const searchClient = algoliasearch(
        ALGOLIA_APPLICATION_ID,
        ALGOLIA_SEARCH_ONLY_KEY,
      );

      const search = instantsearch({
        indexName: "blog",
        searchClient,
        onStateChange({ uiState, setUiState }) {
          const query = uiState.blog?.query || "";
          if (query.length === 0) {
            setShowResults(false);
          }
          setUiState(uiState);
        },
      });

      const customAutocomplete = connectAutocomplete(
        (renderOptions: AutocompleteRenderState, isFirstRender: boolean) => {
          const { indices, refine } = renderOptions;
          const [blog] = indices;

          if (isFirstRender && input) {
            input.addEventListener("input", ({ currentTarget }) => {
              if (currentTarget instanceof HTMLInputElement) {
                const query = currentTarget.value.trim();
                if (query.length > 0) {
                  refine(query);
                } else {
                  setShowResults(false);
                }
              }
            });
          }

          if (blog && input && input.value.length > 0) {
            const fragment = document.createDocumentFragment();

            if (blog.hits.length === 0) {
              setHasResults(false);
            } else {
              setHasResults(true);

              blog.hits.forEach((item) => {
                const hit = item as BlogHit;
                const li = document.createElement("li");
                const a = document.createElement("a");

                a.setAttribute("href", new URL(hit.path, location.origin).href);
                a.textContent = hit.title;
                li.classList.add("search-result-item");
                li.appendChild(a);
                fragment.appendChild(li);
              });

              ul?.replaceChildren();
              ul?.appendChild(fragment);
            }

            setShowResults(true);
          }
        },
      );

      search.addWidgets([
        customAutocomplete({
          // @ts-expect-error type mismatch
          container: document.createElement("div"),
        }),
      ]);

      search.start();
      searchInstanceRef.current = search;

      // Hide results when clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        if (
          !searchResults?.contains(event.target as Node) &&
          event.target !== input
        ) {
          setShowResults(false);
        }
      };

      document.addEventListener("click", handleClickOutside);

      // Show results when input is focused and has content
      const handleFocus = () => {
        if (input.value.length > 0 && ul && ul.children.length > 0) {
          setShowResults(true);
        }
      };

      input.addEventListener("focus", handleFocus);

      return () => {
        document.removeEventListener("click", handleClickOutside);
        input.removeEventListener("focus", handleFocus);
        if (searchInstanceRef.current) {
          searchInstanceRef.current.dispose();
        }
      };
    } catch (error) {
      console.error("Search initialization failed:", error);
    }
  }, []);

  return (
    <>
      <div className="relative">
        <div className="text-icon-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform">
          <Icon icon="mdi:magnify" width="16" height="16" />
        </div>
        <input
          ref={inputRef}
          id="search-input"
          role="searchbox"
          placeholder="記事を検索..."
          className="border-line text-text-main placeholder-text-muted focus:border-text-main focus:ring-text-main w-full rounded-md border bg-white px-3 py-2 pl-10 text-base focus:ring-1 focus:outline-none"
        />
        {/* Search Results Dropdown */}
        <div
          ref={resultsRef}
          id="search-results"
          className={cn(
            "border-line absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border bg-white shadow-lg",
            !showResults && "hidden",
          )}
        >
          <ul
            ref={ulRef}
            id="search-result"
            className={cn("py-2", !hasResults && "hidden")}
          >
            {/* Results will be inserted here */}
          </ul>
          <div
            id="no-results"
            className={cn(
              "text-text-muted p-4 text-center",
              hasResults && "hidden",
            )}
          >
            該当する記事が見つかりませんでした
          </div>
        </div>
      </div>
    </>
  );
}
