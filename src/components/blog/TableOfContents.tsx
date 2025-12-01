import { cn } from "../../utils/cn";

type TableOfContentsProps = {
  headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;
  className?: string;
};

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const indices = headings.filter((heading) => heading.depth <= 3);

  if (indices.length === 0) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <nav aria-label="記事の目次">
        <ul className="space-y-1">
          {indices
            .filter((h) => h.depth <= 3)
            .map((heading) => (
              <li
                key={heading.slug}
                className={
                  heading.depth === 1
                    ? "text-sm font-semibold"
                    : heading.depth === 2
                      ? "border-line ml-2 border-l-2 pl-2 text-sm"
                      : "border-line ml-4 border-l-2 pl-2 text-xs"
                }
              >
                <a
                  href={`#${heading.slug}`}
                  data-toc-link={heading.slug}
                  className={
                    heading.depth === 1
                      ? "text-text-main block w-full rounded px-2 py-1 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      : "text-text-sub block w-full rounded px-2 py-1 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  }
                >
                  {heading.text}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}
