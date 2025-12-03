"use cache";

import { FilterTabs } from "../../_components/FilterTabs";
import { ListContainer } from "../../_components/ListContainer";
import { MediaListItem } from "../../_components/MediaListItem";
import { Section } from "../../_components/Section";
import { createMetadata } from "../../_utils/metadata";
import { sortByDate } from "../../_utils/sortItems";
import { getData } from "./_utils/data";
import { getKindDescription, getKindLabel, getKindPath } from "./_utils/labels";
import type { MediaType } from "./_utils/types";

export const metadata = createMetadata({
  path: "/media",
  title: "Media & Activities",
  description: getKindDescription(undefined),
});

export default async function MediaPage() {
  const items = sortByDate(
    [...getData("talks"), ...getData("articles"), ...getData("podcasts")],
    (item) => item.publishedAt,
  );

  const filterTabs = [undefined, "articles", "talks", "podcasts"].map(
    (kind) => ({
      value: kind as MediaType | undefined,
      label: getKindLabel(kind as MediaType | undefined),
      href: getKindPath(kind as MediaType | undefined),
    }),
  );

  return (
    <Section title="Media & Activities" headingLevel="h1">
      <FilterTabs tabs={filterTabs} activeValue={undefined} className="mb-8" />

      {items.length > 0 ? (
        <ListContainer>
          {items.map(({ title, url, publishedAt, category }) => (
            <MediaListItem
              key={url}
              title={title}
              url={url}
              publishedAt={publishedAt}
              category={category}
            />
          ))}
        </ListContainer>
      ) : (
        <p className="text-text-sub py-12 text-center text-lg">
          該当するメディアが見つかりませんでした
        </p>
      )}
    </Section>
  );
}
