"use cache";

import type { Metadata } from "next";
import { FilterTabs } from "../../../_components/FilterTabs";
import { MediaList } from "../../../_components/MediaListItem";
import { Section } from "../../../_components/Section";
import { createMetadata } from "../../../_utils/metadata";
import { KINDS, TITLE } from "./_constants";
import { getData } from "./_utils/data";
import { getKind } from "./_utils/getKind";
import { getMetadata } from "./_utils/getMetadata";

export async function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

export async function generateMetadata({
  params,
}: PageProps<"/media/[kind]">): Promise<Metadata> {
  const { kind: k } = await params;
  const kind = getKind(k);

  return createMetadata(getMetadata(kind));
}

export default async function Page({ params }: PageProps<"/media/[kind]">) {
  const { kind: k } = await params;
  const kind = getKind(k);
  const items = await getData(kind);
  const filterTabs = KINDS.map((filterKind) => ({
    value: filterKind,
    label: `${filterKind.slice(0, 1).toUpperCase()}${filterKind.slice(1).toLowerCase()}`,
    href: getMetadata(filterKind).path,
  }));

  return (
    <Section title={TITLE} headingLevel="h1">
      <FilterTabs tabs={filterTabs} activeValue={kind} className="mb-8" />
      <MediaList items={items} />
    </Section>
  );
}
