import { ALL_WITH_CATEGORY } from "../(withSidebar)/media/[kind]/_utils/data";
import { cn } from "../_utils/cn";
import { Image } from "./Image";
import { Link } from "./Link";
import { ListContainer } from "./ListContainer";

type Props = {
  items: ALL_WITH_CATEGORY[];
};

export function MediaList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className={cn("text-text-sub py-12 text-center text-lg")}>
        該当するメディアが見つかりませんでした
      </p>
    );
  }

  // TODO: need to investigate favicon urls
  const validatedItems = items.map((item) => ({
    ...item,
    favicon: item.favicon.startsWith("https://prtimes.jp/")
      ? "https://prtimes.jp/common/v4.1/images/html/favicon/favicon-24x24.png"
      : item.favicon.startsWith("https://uit-inside.linecorp.com/")
        ? "https://uit-inside.linecorp.com/assets/images/favicon.png"
        : item.favicon,
  }));

  return (
    <ListContainer className="space-y-10">
      {validatedItems.map(
        ({ title, name, url, publishedAt, category, favicon }) => (
          <li className="block" key={url}>
            <Link href={url} className="no-underline space-y-3">
              <div className="flex items-center justify-between text-text-sub">
                <span className="block text-sm">
                  {publishedAt}
                  {category && ` / ${category}`}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{name}</span>
                  <Image
                    src={favicon}
                    alt={name ?? ""}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </div>
              </div>
              <p className="text-xl leading-relaxed font-normal">{title}</p>
            </Link>
          </li>
        ),
      )}
    </ListContainer>
  );
}
