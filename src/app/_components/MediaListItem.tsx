import { cn } from "../_utils/cn";
import { Link } from "./Link";

type Props = {
  title: string;
  url: string;
  publishedAt: string;
  category?: string;
  className?: string;
};

export function MediaListItem({
  title,
  url,
  publishedAt,
  category,
  className,
}: Props) {
  return (
    <li className={cn("mb-6 block", className)}>
      <Link
        href={url}
        unstyled
        className="text-text-main block no-underline hover:opacity-60"
      >
        <span className="text-text-sub mb-1 block text-sm">
          {publishedAt}
          {category && ` / ${category}`}
        </span>
        <span className="text-xl leading-relaxed font-normal">{title}</span>
      </Link>
    </li>
  );
}
