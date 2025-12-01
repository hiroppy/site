import type { Metadata } from "next";
import { FilterTabs } from "../../../../components/FilterTabs";
import { MediaList } from "../../../../components/MediaList";
import { Section } from "../../../../components/Section";
import { MEDIA_KINDS } from "../../../../constants";
import { getKind } from "../../../../utils/media";
import { createMetadata } from "../../../../utils/metadata";
import { getMetadata, getStaticParams, title } from "./_metadata";

export async function generateStaticParams() {
  return getStaticParams();
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
  const filterTabs = MEDIA_KINDS.map((filterKind) => ({
    value: filterKind,
    label: `${filterKind.slice(0, 1).toUpperCase()}${filterKind.slice(1).toLowerCase()}`,
    href: getMetadata(filterKind).path,
  }));

  return (
    <Section title={title} headingLevel="h1">
      <FilterTabs tabs={filterTabs} activeValue={kind} className="mb-8" />
      <MediaList kind={kind} />
    </Section>
  );
}
