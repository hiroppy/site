"use cache";

import { MediaKind } from "../constants";
import { getData } from "../utils/media";
import { Image } from "./Image";
import { Link } from "./Link";
import { ListContainer } from "./ListContainer";
import { NotFoundItem } from "./NotFoundItem";

type Props = {
  kind: MediaKind;
  length?: number;
  includeBlog?: boolean;
};

export async function MediaList({ kind, length, includeBlog }: Props) {
  const res = await getData(kind, { includeBlog });
  const items = length ? res.slice(0, length) : res;

  if (items.length === 0) {
    return <NotFoundItem>該当するメディアが見つかりませんでした</NotFoundItem>;
  }

  return (
    <ListContainer className="space-y-6">
      {items.map(({ title, name, url, publishedAt, category, favicon }) => (
        <li className="block" key={url}>
          <Link href={url} className="no-underline space-y-4 lg:space-y-3">
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
                  className="rounded-full w-5 h-5"
                />
              </div>
            </div>
            <p className="text-xl leading-relaxed font-normal">{title}</p>
          </Link>
        </li>
      ))}
    </ListContainer>
  );
}
