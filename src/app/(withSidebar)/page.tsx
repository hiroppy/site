"use cache";

import articlesData from "hiroppy/generated/media.json";
import podcastsData from "hiroppy/generated/podcasts.json";
import repos from "hiroppy/generated/repos.json";
import sponsors from "hiroppy/generated/sponsors.json";
import talksData from "hiroppy/generated/talks.json";
import { Avatar } from "../_components/Avatar";
import { Link } from "../_components/Link";
import { ListContainer } from "../_components/ListContainer";
import { MediaListItem } from "../_components/MediaListItem";
import { ProjectLinks } from "../_components/ProjectLink";
import { Section } from "../_components/Section";
import { SectionContainer } from "../_components/SectionContainer";
import { getStarCount } from "../_utils/github";
import { createMetadata } from "../_utils/metadata";

export const metadata = createMetadata({
  path: "/",
  title: "hiroppy - Web Engineer",
  description: "Web Engineer in Tokyo. Likes Open Source, Sauna, and Games.",
});

type MediaItem = {
  title: string;
  url: string;
  publishedAt: string;
  category: string;
};

export default async function HomePage() {
  // Combine and sort all media
  const allMedia: MediaItem[] = [
    ...articlesData.map((item) => ({
      ...item,
      category: "Article",
    })),
    ...talksData.map((item) => ({ ...item, category: "Talk" })),
    ...podcastsData.map((item) => ({
      ...item,
      category: "Podcast",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  // Get repos with star counts
  const reposWithStars = await Promise.all(
    repos.hot.slice(0, 3).map(async (repo) => {
      const [, , , owner, repoName] = repo.url.split("/");
      return {
        ...repo,
        image: repo.image?.startsWith("http")
          ? repo.image
          : `https://avatars.githubusercontent.com/${owner}`,
        stars: await getStarCount(owner, repoName),
      };
    }),
  );

  return (
    <SectionContainer>
      <Section title="Recent Updates" headingLevel="h1">
        <ListContainer>
          {allMedia.map(({ url, title, publishedAt, category }) => (
            <MediaListItem
              key={url}
              url={url}
              title={title}
              publishedAt={publishedAt}
              category={category}
            />
          ))}
        </ListContainer>
      </Section>

      <Section title="Works / OSS">
        <ProjectLinks projects={reposWithStars} />
      </Section>

      <Section title="Thanks / Sponsors">
        <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3">
          {[...sponsors.current, ...sponsors.past].map(
            ({ name, avatar, href }) => (
              <Link
                key={name || avatar}
                href={
                  href?.includes("https://docs.github.com/sponsors")
                    ? "https://github.com"
                    : (href ?? "https://github.com")
                }
                unstyled
                className="border-line text-text-sub inline-flex items-center gap-2 rounded border px-3 py-2 text-base font-medium no-underline transition-colors hover:bg-gray-100"
              >
                {avatar && <Avatar src={avatar} alt="" size="xs" />}
                <span>{name ?? "Private user"}</span>
              </Link>
            ),
          )}
        </div>
      </Section>
    </SectionContainer>
  );
}
