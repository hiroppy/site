"use cache";

import repos from "hiroppy/generated/repos.json";
import { MediaList } from "../_components/MediaListItem";
import { Repositories } from "../_components/Repositories";
import { Section } from "../_components/Section";
import { SectionContainer } from "../_components/SectionContainer";
import { createMetadata } from "../_utils/metadata";
import { Sponsors } from "./_components/Sponsors";
import { getData } from "./media/[kind]/_utils/data";

export const metadata = createMetadata({
  path: "/",
  title: "hiroppy - Web Engineer",
  description: "Web Engineer in Tokyo. Likes Open Source, Sauna, and Games.",
});

export default async function Page() {
  const allMedia = (await getData("all")).slice(0, 3);

  return (
    <SectionContainer>
      <Section title="Recent Updates" headingLevel="h1">
        <MediaList items={allMedia} />
      </Section>
      <Section title="Works / OSS">
        <Repositories
          repos={repos.hot.slice(0, 3).map((repo) => ({
            owner: repo.url.split("/")[3],
            repo: repo.url.split("/")[4],
          }))}
        />
      </Section>
      <Section title="Thanks / Sponsors">
        <Sponsors />
      </Section>
    </SectionContainer>
  );
}
