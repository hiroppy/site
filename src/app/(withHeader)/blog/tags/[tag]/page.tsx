import { Icon } from "../../../../_components/Icon";
import {
  getAllTags,
  getBlogs,
  parseTags,
} from "../../../../_utils/blogHelpers";
import { createMetadata } from "../../../../_utils/metadata";
import { BlogCard } from "../../_components/BlogCard";
import { TagsBox } from "../../_components/TagsBox";

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;
  return createMetadata({
    path: `/blog/tags/${tag}`,
    title: `${tag} - Blog`,
    description: `Blog posts tagged with ${tag}`,
  });
}

export async function generateStaticParams() {
  const posts = await getBlogs();
  const allTags = getAllTags(posts);
  return allTags.map((tag) => ({ tag }));
}

export default async function TagPage({
  params,
}: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;
  const posts = await getBlogs();
  const allTags = getAllTags(posts);

  // Filter posts by tag
  const filteredPosts = posts.filter((post) => {
    const postTags = parseTags(post.frontmatter.tags);
    return postTags.includes(tag);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-4 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{tag}</h1>
        <p className="text-gray-600">
          関連する記事一覧（{filteredPosts.length}件）
        </p>
      </div>

      {/* Tags */}
      <div className="sticky top-16 z-40 py-6 backdrop-blur-lg">
        <TagsBox tags={allTags} currentTag={tag} />
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Icon
            icon="mdi:file-document-outline"
            className="mb-4 text-6xl opacity-20"
            width="1.5em"
            height="1.5em"
          />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            記事が見つかりません
          </h2>
          <p className="text-gray-600">{tag}タグの記事がありません</p>
        </div>
      )}
    </div>
  );
}
