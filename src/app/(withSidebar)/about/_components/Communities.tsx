import meta from "hiroppy/generated/meta.json";
import { Card, CardImage } from "../../../../components/Card";
import { DateRange } from "../../../../components/DateRange";
import { ListContainer } from "../../../../components/ListContainer";
import { SectionSubheading } from "../../jobs/_components/SectionSubheading";

export function Communities() {
  return (
    <div className="flex flex-col gap-12">
      {Object.entries(meta.community).map(([title, history]) => {
        return (
          <div key={title} className="space-y-4">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
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
                      <CardImage
                        src={image}
                        alt={title}
                        variant="thumbnail"
                        lazy
                      />
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
