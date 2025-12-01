import type { CollectionEntry } from "astro:content";
import { Card } from "../Card";
import { CardContent } from "../CardContent";
import { CardDescription } from "../CardDescription";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "../CardTitle";
import { CardImage } from "../CardImage";
import { Icon } from "../Icon";
import { Badge } from "./Badge";
import { parseTags } from "../../utils/blog/index";
import { formatDate } from "../../utils/formatDate";
import {
  getBlogItemUrl,
  getBlogItemImageAlt,
  getBlogItemAriaLabel,
} from "../../utils/blog/components";

type Props = {
  post: CollectionEntry<"blog">;
  currentTag?: string;
  maxTags?: number;
};

export function BlogCard({ post, currentTag, maxTags = 3 }: Props) {
  const { data, slug } = post;

  return (
    <Card
      variant="interactive"
      className="flex h-full flex-col"
      link={{
        href: getBlogItemUrl(slug),
        ariaLabel: getBlogItemAriaLabel(data.title),
      }}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          {data.image ? (
            <CardImage
              src={data.image}
              alt={getBlogItemImageAlt(data.title)}
              variant="cover"
              className="card-image-zoom"
              loading="eager"
            />
          ) : (
            <div className="from-surface to-surface-hover flex h-48 w-full items-center justify-center bg-gradient-to-br">
              <Icon
                icon="mdi:file-document-outline"
                className="text-6xl opacity-20"
                width="1.5em"
                height="1.5em"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col">
        <div className="text-text-muted mb-3 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1" data-testid="blog-date">
            <Icon icon="mdi:calendar" width="16" height="16" />
            <span>{formatDate(data.date)}</span>
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
              <Badge
                key={tag}
                variant={
                  currentTag && tag === currentTag ? "primary" : "secondary"
                }
              >
                {tag}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
