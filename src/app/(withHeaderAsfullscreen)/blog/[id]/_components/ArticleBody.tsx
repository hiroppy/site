import { Icon } from "../../../../_components/Icon";
import { Link } from "../../../../_components/Link";
import { parseTags } from "../../../../_utils/blogHelpers";
import { HATENA_BLOG_ENTRY_URL } from "../../../../_utils/constants";
import { Badge } from "../../_components/Badge";
import { References } from "../../_components/References";
import { ShareButtons } from "../../_components/ShareButtons";
import { TableOfContents } from "../../_components/TableOfContents";
import { buildPostUrls } from "../_utils/buildPostUrls";

type ArticleBodyProps = {
  id: string;
  frontmatter: {
    title: string;
    tags: string;
    hatenaPath?: string;
  };
  diffDate: number;
  MDXContent: React.ComponentType;
  headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;
  referencesWithTitles: Array<{
    url: string;
    title: string;
  }>;
};

export function ArticleBody({
  id,
  frontmatter,
  diffDate,
  MDXContent,
  headings,
  referencesWithTitles,
}: ArticleBodyProps) {
  const { github: githubUrl, post: postUrl } = buildPostUrls(id);
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {parseTags(frontmatter.tags).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              <Link
                href={`/blog/tags/${tag}`}
                unstyled
                ariaLabel={`${tag}タグの記事を表示`}
              >
                {tag}
              </Link>
            </Badge>
          ))}
        </div>
        <Link
          href={githubUrl}
          icon="mdi:github"
          variant="button"
          ariaLabel="Edit this page on GitHub"
        >
          Edit
        </Link>
      </div>

      <hr className="mb-4 border-gray-200" />

      {/* Mobile Table of Contents */}
      <details className="bg-bg mb-8 rounded-lg p-6 lg:hidden">
        <summary className="cursor-pointer font-semibold text-gray-600">
          目次
        </summary>
        <div className="mt-4">
          <TableOfContents headings={headings} />
        </div>
      </details>

      {/* Warning Banners */}
      <div className="mb-8 space-y-4">
        {diffDate > 365 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center">
              <Icon
                icon="mdi:alert"
                className="mr-2 text-yellow-600"
                width={20}
                height={20}
              />
              <span className="text-sm font-medium text-yellow-800">
                この記事は1年以上更新されていません
              </span>
            </div>
          </div>
        )}
        {frontmatter.hatenaPath && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center">
              <Icon
                icon="mdi:check-circle"
                className="mr-2 text-blue-600"
                width={20}
                height={20}
              />
              <span className="text-sm text-blue-800">
                この記事は{" "}
                <Link
                  href={`${HATENA_BLOG_ENTRY_URL}/${frontmatter.hatenaPath}`}
                  className="underline"
                >
                  Hatena Blog
                </Link>{" "}
                からの移行記事です
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <MDXContent />
      </div>

      {referencesWithTitles.length > 0 && (
        <References references={referencesWithTitles} />
      )}

      <hr className="my-8 border-gray-200" />

      <div className="mb-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ShareButtons url={postUrl} title={frontmatter.title} />
        </div>
      </div>
    </div>
  );
}
