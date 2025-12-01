import repos from "hiroppy/generated/repos.json";
import { MediaList } from "../../components/MediaList";
import { Repositories } from "../../components/Repositories";
import { SectionContainer, Section } from "../../components/Section";
import { createMetadata } from "../../utils/metadata";
import { Sponsors } from "./_components/Sponsors";
import { description, title } from "./_metadata";

export const metadata = createMetadata({
  path: "/",
  title,
  description,
});

export default async function Page() {
  return (
    <SectionContainer>
      <Section title="Recent Updates" headingLevel="h1">
        <MediaList kind="all" length={3} includeBlog />
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
