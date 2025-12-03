"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterTabs } from "../../../_components/FilterTabs";
import { ListContainer } from "../../../_components/ListContainer";
import { MediaListItem } from "../../../_components/MediaListItem";
import { Section } from "../../../_components/Section";
import { createMetadata } from "../../../_utils/metadata";
import { getData } from "../_utils/data";
import {
  getKindDescription,
  getKindLabel,
  getKindPath,
} from "../_utils/labels";
import { type MediaType, VALID_KINDS } from "../_utils/types";

export async function generateStaticParams() {
  return VALID_KINDS.map((kind) => ({ kind }));
}

export async function generateMetadata({
  params,
}: PageProps<"/media/[kind]">): Promise<Metadata> {
  const { kind } = await params;

  if (!VALID_KINDS.includes(kind as MediaType)) {
    return createMetadata({
      path: "/media",
      title: "Media & Activities",
      description: getKindDescription(undefined),
    });
  }

  const kindStr = kind as MediaType;

  return createMetadata({
    path: `/media/${kindStr}`,
    title: `Media & Activities / ${getKindLabel(kindStr)}`,
    description: getKindDescription(kindStr),
  });
}

export default async function MediaKindPage({
  params,
}: PageProps<"/media/[kind]">) {
  const { kind } = await params;

  if (!VALID_KINDS.includes(kind as MediaType)) {
    notFound();
  }

  const kindStr = kind as MediaType;
  const items = getData(kindStr);

  const filterTabs = [undefined, ...VALID_KINDS].map((filterKind) => ({
    value: filterKind as MediaType | undefined,
    label: getKindLabel(filterKind as MediaType | undefined),
    href: getKindPath(filterKind as MediaType | undefined),
  }));

  return (
    <Section title="Media & Activities" headingLevel="h1">
      <FilterTabs tabs={filterTabs} activeValue={kindStr} className="mb-8" />

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
