import { MdCalendarToday, MdDescription } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "../../../../components/Card";
import { Tag } from "../../../../components/Tag";
import type { BlogPostPreview } from "../../../../mdx/types";
import { parseTags } from "../../../../utils/blog";
import { formatDateJapanese } from "../../../../utils/formatDate";

type Props = {
  post: BlogPostPreview;
  lazy?: boolean;
  maxTags?: number;
};

export function BlogCard({ post, lazy, maxTags = 3 }: Props) {
  const { frontmatter: data, id } = post;

  return (
    <Card
      variant="interactive"
      className="flex h-full flex-col"
      link={{
        href: `/blog/posts/${id}`,
        ariaLabel: `記事「${data.title}」を読む`,
        prefetch: false,
      }}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          {data.image ? (
            <CardImage
              src={data.image}
              alt={data.title}
              variant="cover"
              className="transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform group-hover:scale-110"
              lazy={lazy}
            />
          ) : (
            <div className="from-surface to-surface-hover flex h-48 w-full items-center justify-center bg-linear-to-br">
              <MdDescription
                className="text-6xl opacity-20 w-[1.5em] h-[1.5em]"
                aria-hidden="true"
                focusable="false"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex grow flex-col">
        <div className="text-text-muted mb-3 flex items-center space-x-4 text-sm">
          <div className="flex items-center gap-2" data-testid="blog-date">
            <MdCalendarToday size={16} aria-hidden="true" focusable="false" />
            <span>{formatDateJapanese(data.date)}</span>
          </div>
        </div>
        <CardTitle className="mb-3 line-clamp-2 text-xl leading-relaxed">
          {data.title}
        </CardTitle>
        <CardDescription className="mb-4 line-clamp-3">
          {data.description}
        </CardDescription>
        <div className="mt-auto flex flex-wrap gap-2">
          {parseTags(data.tags)
            .slice(0, maxTags)
            .map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
