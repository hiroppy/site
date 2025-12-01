import { Card } from "../Card";
import { CardImage } from "../CardImage";
import { Icon } from "../Icon";

type CommunityLink = {
  title: string;
  description: string;
  image: string;
  url: string;
  name?: string;
};

type Props = {
  link: CommunityLink;
  year?: string;
};

export function CommunityActivityCard({ link, year }: Props) {
  return (
    <Card
      link={{ href: link.url, ariaLabel: `${link.title}の詳細を見る` }}
      className="group/card flex gap-2 overflow-hidden p-2 shadow-sm transition-all duration-300 hover:shadow-md sm:gap-3 sm:p-3"
    >
      {link.image ? (
        <CardImage src={link.image} alt={link.title} variant="thumbnail" />
      ) : (
        <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-gray-100 to-gray-200" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {(year || link.name) && (
          <div className="text-text-sub flex items-center justify-between text-xs">
            {year && <span>{year}</span>}
            {link.name && (
              <div className="flex items-center gap-1">
                <Icon icon="mdi:domain" width={12} height={12} />
                <span className="truncate">{link.name}</span>
              </div>
            )}
          </div>
        )}

        <h4 className="text-text-main group-hover/card:text-link line-clamp-2 text-sm font-semibold transition-colors">
          {link.title}
        </h4>

        <p className="text-text-sub line-clamp-2 text-xs">{link.description}</p>
      </div>
    </Card>
  );
}
