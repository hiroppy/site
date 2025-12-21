import {
  Card,
  CardContent,
  CardTitle,
} from "../../../../../../components/Card";
import type { BlogPostPreview } from "../../../../../../mdx/types";

type Props = {
  prev: BlogPostPreview | null;
  next: BlogPostPreview | null;
};

export function AdjacentPostCards({ prev, next }: Props) {
  if (!prev && !next) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="mb-6 text-xl font-bold text-gray-900">前後の記事</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {prev ? (
          <Card
            className="transition-all duration-300 hover:shadow-lg"
            link={{
              href: `/blog/posts/${prev.id}`,
              ariaLabel: `前の記事: ${prev.frontmatter.title}`,
            }}
          >
            <CardContent>
              <div className="mb-2 text-xs text-gray-500">← 前の記事</div>
              <CardTitle className="line-clamp-2 text-sm">
                {prev.frontmatter.title}
              </CardTitle>
            </CardContent>
          </Card>
        ) : (
          <div />
        )}
        {next ? (
          <Card
            className="transition-all duration-300 hover:shadow-lg"
            link={{
              href: `/blog/posts/${next.id}`,
              ariaLabel: `次の記事: ${next.frontmatter.title}`,
            }}
          >
            <CardContent className="text-right">
              <div className="mb-2 text-xs text-gray-500">次の記事 →</div>
              <CardTitle className="line-clamp-2 text-sm" level={3}>
                {next.frontmatter.title}
              </CardTitle>
            </CardContent>
          </Card>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
