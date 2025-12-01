"use cache";

import { SiGithub } from "react-icons/si";
import { Link } from "../../../../../../components/Link";
import { Tag } from "../../../../../../components/Tag";
import type { BlogPost } from "../../../../../../mdx/types";
import { parseTags } from "../../../../../../utils/blog";
import { References } from "./References";
import { ShareButtons } from "./ShareButtons";
import { TableOfContents } from "./TableOfContents";
import { HatenaMigrationLabel, OverOneYearOldLabel } from "./WarningLabels";

type Props = BlogPost;

export async function ArticleBody({
  id,
  frontmatter,
  MDXContent,
  headings,
}: Props) {
  return (
    <div className="px-4 py-8 md:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {parseTags(frontmatter.tags).map((tag) => (
            <Tag key={tag} href={`/blog/tags/${tag}`}>
              {tag}
            </Tag>
          ))}
        </div>
        <Link
          href={`https://github.com/hiroppy/site/tree/main/src/content/blog/${id}.mdx`}
          icon={<SiGithub aria-hidden="true" focusable="false" />}
          variant="button"
          ariaLabel="Edit this page on GitHub"
        >
          Edit
        </Link>
      </div>
      <hr className="border-gray-200" />
      <details className="bg-bg rounded-lg p-6 lg:hidden">
        <summary className="cursor-pointer font-semibold text-gray-600">
          目次
        </summary>
        <div className="mt-4">
          <TableOfContents headings={headings} />
        </div>
      </details>
      <div className="space-y-4">
        <OverOneYearOldLabel publishedAt={frontmatter.date} />
        <HatenaMigrationLabel hatenaPath={frontmatter.hatenaPath} />
      </div>
      <div className="prose prose-lg max-w-none">
        <MDXContent />
      </div>
      <References references={frontmatter.references ?? []} />
      <hr className=" border-gray-200" />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ShareButtons id={id} title={frontmatter.title} />
      </div>
    </div>
  );
}
