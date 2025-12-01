"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "../../../../../../components/Link";
import { cn } from "../../../../../../utils/cn";

type TableOfContentsProps = {
  headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;
  className?: string;
};

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<{
    [key: string]: IntersectionObserverEntry;
  }>({});

  const indices = headings.filter((heading) => heading.depth <= 3);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        headingElementsRef.current[entry.target.id] = entry;
      });

      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting,
      );

      if (visibleHeadings.length > 0) {
        const sortedVisible = visibleHeadings.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        setActiveId(sortedVisible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -80% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    const headingElements = indices
      .map((heading) => document.getElementById(heading.slug))
      .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [indices]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", `#${slug}`);
      setActiveId(slug);
    }
  };

  if (indices.length === 0) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <nav aria-label="記事の目次">
        <ul className="space-y-1">
          {indices.map((heading) => {
            const isActive = activeId === heading.slug;
            return (
              <li
                key={`${heading.slug}`}
                className={
                  heading.depth === 1
                    ? "text-sm font-semibold"
                    : heading.depth === 2
                      ? "border-line ml-2 border-l-2 pl-2 text-sm"
                      : "border-line ml-4 border-l-2 pl-2 text-xs"
                }
              >
                <Link
                  href={`#${heading.slug}`}
                  unstyled
                  onClick={(e) => handleClick(e, heading.slug)}
                  className={cn(
                    "block w-full rounded px-2 py-1 transition-colors",
                    isActive
                      ? "bg-blue-100"
                      : "hover:bg-blue-50 hover:text-blue-700",
                    heading.depth === 1 ? "text-text-main" : "text-text-sub",
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
