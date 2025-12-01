import { Link } from "../../../../components/Link";
import { cn } from "../../../../utils/cn";
import { commonStyles } from "../../../../utils/commonStyles";

type Props = {
  tag: string;
  className?: string;
  active?: boolean;
};

export function BlogTag({ tag, className, active = false }: Props) {
  const tagPath = `/blog/tags/${tag}`;
  const href = active ? "/blog/1" : tagPath;

  return (
    <Link
      className={cn(
        "rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors hover:no-underline",
        commonStyles.focusRing,
        active
          ? "bg-accent border-accent text-bg hover:opacity-80"
          : "text-text-main border-line hover:text-link hover:bg-surface bg-white",
        className,
      )}
      unstyled
      href={href}
      ariaLabel={active ? "クリックして全ての記事を表示" : `${tag}の記事を表示`}
    >
      {tag}
    </Link>
  );
}
