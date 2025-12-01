import { MdArrowBack, MdToc } from "react-icons/md";
import { Link } from "../../../../../../components/Link";
import { TableOfContents } from "./TableOfContents";

type SidebarProps = {
  headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;
};

export function Sidebar({ headings }: SidebarProps) {
  return (
    <aside className="bg-bg hidden w-72 shrink-0 border-r border-gray-200 lg:block">
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col">
        <div className="shrink-0 px-6 pt-10 pb-4">
          <h2 className="flex items-center text-sm font-semibold text-gray-900">
            <MdToc
              className="mr-2"
              size={16}
              aria-hidden="true"
              focusable="false"
            />
            目次
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <TableOfContents headings={headings} />
        </div>
        <div className="flex h-20 shrink-0 items-center border-t border-gray-200 px-6">
          <Link
            href="/blog/1"
            animation={false}
            unstyled
            className="flex items-center text-sm font-medium text-gray-600"
          >
            <MdArrowBack
              className="mr-2"
              size={16}
              aria-hidden="true"
              focusable="false"
            />
            blog一覧に戻る
          </Link>
        </div>
      </div>
    </aside>
  );
}
