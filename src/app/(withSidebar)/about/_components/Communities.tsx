import type { Meta } from "hiroppy/types";
import { Card } from "../../../_components/Card";
import { CardImage } from "../../../_components/CardImage";
import { DateRange } from "../../../_components/DateRange";
import { ListContainer } from "../../../_components/ListContainer";
import { SectionSubheading } from "../../jobs/_components/SectionSubheading";

type Props = {
  communities: Meta["community"];
};

export function Communities({ communities }: Props) {
  return (
    <div className="flex flex-col gap-12">
      {Object.entries(communities).map(([title, history]) => {
        return (
          <div key={title} className="space-y-4">
            <div className="flex justify-between items-center">
              <SectionSubheading className="mb-0">
                {history.position}
              </SectionSubheading>
              <DateRange
                start={history.start}
                end={history.end}
                variant="text"
                isActive={!history.end}
              />
            </div>
            {history.links.length > 0 && (
              <ListContainer className="space-y-4">
                {history.links.map(({ url, title, image, description }) => (
                  <li key={url}>
                    <Card
                      link={{
                        href: url,
                        ariaLabel: `${title}の詳細を見る`,
                      }}
                      className="group/card flex gap-2 overflow-hidden p-2 shadow-sm transition-all duration-300 hover:shadow-md sm:gap-3 sm:p-3"
                    >
                      {image ? (
                        <CardImage
                          src={image}
                          alt={title}
                          variant="thumbnail"
                          lazy
                        />
                      ) : (
                        <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-gray-100 to-gray-200" />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <h4 className="text-text-main group-hover/card:text-link line-clamp-2 text-sm font-semibold transition-colors">
                          {title}
                        </h4>
                        <p className="text-text-sub line-clamp-2 text-xs">
                          {description}
                        </p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ListContainer>
            )}
          </div>
        );
      })}
    </div>
  );
}
