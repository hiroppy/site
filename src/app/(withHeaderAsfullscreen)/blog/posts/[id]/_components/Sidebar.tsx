import { Icon } from "../../../../../_components/Icon";
import { Link } from "../../../../../_components/Link";
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
            <Icon
              icon="mdi:table-of-contents"
              className="mr-2"
              width={16}
              height={16}
            />
            目次
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <TableOfContents headings={headings} />
        </div>
        <div className="flex h-20 shrink-0 items-center border-t border-gray-200 px-6">
          <Link
            href="/blog"
            animation={false}
            unstyled
            className="flex items-center text-sm font-medium text-gray-600"
          >
            <Icon
              icon="mdi:arrow-left"
              className="mr-2"
              width={16}
              height={16}
            />
            blog一覧に戻る
          </Link>
        </div>
      </div>
    </aside>
  );
}
