import { MdDescription } from "react-icons/md";
import {
  Card,
  CardContent,
  CardTitle,
} from "../../../../../../components/Card";
import { Image } from "../../../../../../components/Image";
import { Tag } from "../../../../../../components/Tag";
import type { BlogPostPreview } from "../../../../../../mdx/types";
import { parseTags } from "../../../../../../utils/blog";
import { formatDateJapanese } from "../../../../../../utils/formatDate";

type Props = {
  posts: BlogPostPreview[];
};

export function RelatedPostCards({ posts }: Props) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="mb-6 text-xl font-bold text-gray-900">関連する記事</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="transition-all duration-300 hover:shadow-lg"
            link={{
              href: `/blog/posts/${post.id}`,
              ariaLabel: `関連記事: ${post.frontmatter.title}`,
            }}
          >
            <CardContent>
              <div className="flex items-center">
                {post.frontmatter.image && (
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    width={120}
                    height={80}
                    className="h-20 w-24 rounded-lg object-cover"
                  />
                )}
                {!post.frontmatter.image && (
                  <div className="flex h-20 w-24 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-purple-50">
                    <MdDescription
                      className="text-2xl opacity-30"
                      size="1em"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2 pl-4">
                  <Tag>{parseTags(post.frontmatter.tags)?.[0] || "記事"}</Tag>
                  <CardTitle className="mb-2 line-clamp-2 text-sm" level={3}>
                    {post.frontmatter.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    {formatDateJapanese(post.frontmatter.date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
