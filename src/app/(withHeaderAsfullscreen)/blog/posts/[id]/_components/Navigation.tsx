"use cache";

import { MdDescription } from "react-icons/md";
import {
  Card,
  CardContent,
  CardTitle,
} from "../../../../../../components/Card";
import { Image } from "../../../../../../components/Image";
import { Tag } from "../../../../../../components/Tag";
import { getBlogPosts } from "../../../../../../mdx/contentLoader";
import { parseTags } from "../../../../../../utils/blog";
import { formatDate } from "../../../../../../utils/formatDate";

type Props = {
  id: string;
  tags: string;
};

export async function Navigation({ id, tags }: Props) {
  const posts = await getBlogPosts();
  const index = posts.findIndex((p) => p.id === id);
  const currentTags = parseTags(tags);

  const relatedPosts = posts
    .filter((p) => p.id !== id)
    .filter((p) => {
      const blogTags = parseTags(p.frontmatter.tags);
      return currentTags.some((tag) => blogTags.includes(tag));
    })
    .slice(0, 2);

  return (
    <>
      {index !== -1 && (
        <section className="my-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">前後の記事</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {index !== 0 ? (
              <Card
                className="transition-all duration-300 hover:shadow-lg"
                link={{
                  href: `/blog/${posts[index - 1].id}`,
                  ariaLabel: `前の記事: ${posts[index - 1].frontmatter.title}`,
                }}
              >
                <CardContent>
                  <div className="mb-2 text-xs text-gray-500">← 前の記事</div>
                  <CardTitle className="line-clamp-2 text-sm">
                    {posts[index - 1].frontmatter.title}
                  </CardTitle>
                </CardContent>
              </Card>
            ) : (
              <div />
            )}
            {index !== posts.length - 1 ? (
              <Card
                className="transition-all duration-300 hover:shadow-lg"
                link={{
                  href: `/blog/${posts[index + 1].id}`,
                  ariaLabel: `次の記事: ${posts[index + 1].frontmatter.title}`,
                }}
              >
                <CardContent className="text-right">
                  <div className="mb-2 text-xs text-gray-500">次の記事 →</div>
                  <CardTitle className="line-clamp-2 text-sm" level={3}>
                    {posts[index + 1].frontmatter.title}
                  </CardTitle>
                </CardContent>
              </Card>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}
      {relatedPosts.length > 0 && (
        <section className="my-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">関連する記事</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="transition-all duration-300 hover:shadow-lg"
                link={{
                  href: `/blog/${relatedPost.id}`,
                  ariaLabel: `関連記事: ${relatedPost.frontmatter.title}`,
                }}
              >
                <CardContent>
                  <div className="flex items-center">
                    {relatedPost.frontmatter.image && (
                      <Image
                        src={relatedPost.frontmatter.image}
                        alt={relatedPost.frontmatter.title}
                        width={120}
                        height={80}
                        className="h-20 w-24 rounded-lg object-cover"
                      />
                    )}
                    {!relatedPost.frontmatter.image && (
                      <div className="flex h-20 w-24 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-purple-50">
                        <MdDescription
                          className="text-2xl opacity-30"
                          size="1em"
                          aria-hidden="true"
                          focusable="false"
                        />
                      </div>
                    )}
                    <div className="flex-1 pl-4 space-y-2">
                      <Tag>
                        {parseTags(relatedPost.frontmatter.tags)?.[0] || "記事"}
                      </Tag>
                      <CardTitle
                        className="mb-2 line-clamp-2 text-sm"
                        level={3}
                      >
                        {relatedPost.frontmatter.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        {formatDate(relatedPost.frontmatter.date)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
