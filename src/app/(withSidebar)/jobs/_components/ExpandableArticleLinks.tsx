import type { LinkMeta } from "hiroppy/types";
import { Card } from "../../../_components/Card";
import { CardImage } from "../../../_components/CardImage";
import { Icon } from "../../../_components/Icon";

type Props = {
  links: LinkMeta[];
  companyName: string;
};

export function ExpandableArticleLinks({ links, companyName }: Props) {
  const articleLinks = links.filter((link) => link.title && link.description);
  const uniqueId = `article-${companyName.replace(/\s+/g, "-").toLowerCase()}-${articleLinks.length}`;

  if (articleLinks.length === 0) {
    return null;
  }

  return (
    <div className="border-line mt-4 border-t pt-4">
      <details className="group">
        <summary className="text-text-main flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm font-medium transition-colors select-none hover:opacity-60">
          <div className="flex items-center space-x-2">
            <Icon
              icon="mdi:newspaper-variant-outline"
              width={18}
              height={18}
              className="text-text-muted"
            />
            <span>関連記事 ({articleLinks.length}件)</span>
          </div>
          <Icon
            icon="mdi:chevron-down"
            width={20}
            height={20}
            className="text-icon-muted transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <div className="expandable-content mt-3 overflow-hidden">
          <div
            id={uniqueId}
            className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:thin]"
          >
            {articleLinks.map(({ url, title, image, name }) => (
              <Card
                key={url}
                link={{
                  href: url ?? "",
                  ariaLabel: `${title}を読む`,
                }}
                className="group/card w-40 shrink-0 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-surface relative h-24 overflow-hidden">
                  {image ? (
                    <CardImage
                      src={image}
                      alt={title ?? "記事画像"}
                      variant="expand"
                    />
                  ) : (
                    <div className="from-surface to-surface-hover flex h-full w-full items-center justify-center bg-linear-to-br">
                      <Icon
                        icon="mdi:newspaper-variant-outline"
                        width={32}
                        height={32}
                        className="text-icon-muted"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                </div>
                <div className="p-2 space-y-4 text-xs">
                  {name ? (
                    <p className=" text-text-muted truncate">{name}</p>
                  ) : (
                    <div />
                  )}
                  <h5 className="text-heading mb-1 line-clamp-2 font-semibold transition-opacity group-hover/card:opacity-70">
                    {title}
                  </h5>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
