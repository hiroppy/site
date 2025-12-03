"use cache";

import meta from "hiroppy/generated/meta.json";
import { DateRange } from "../../_components/DateRange";
import { Link } from "../../_components/Link";
import { ListContainer } from "../../_components/ListContainer";
import { ProjectLinks } from "../../_components/ProjectLink";
import { Section } from "../../_components/Section";
import { SectionContainer } from "../../_components/SectionContainer";
import { getRepositoryInfo } from "../../_utils/github";
import { createMetadata } from "../../_utils/metadata";
import { CommunityActivityCard } from "./_components/CommunityActivityCard";

export const metadata = createMetadata({
  path: "/about",
  title: "About - hiroppy",
  description:
    "JavaScript Engineer, Speaker, OSS Contributor, Community Organizer",
});

type CommunityLink = {
  title: string;
  description: string;
  image: string;
  url: string;
  name?: string;
};

type CommunityActivity = {
  position: string;
  start: string;
  end: string;
  links: CommunityLink[];
};

export default async function AboutPage() {
  const { profile, sns, site, community } = meta as any;

  // Convert community object to array for easier iteration
  const communityActivities = Object.entries(community).map(([key, value]) => ({
    id: key,
    title: (value as CommunityActivity).position,
    start: (value as any).start,
    end: (value as any).end,
    links: (value as any).links,
  }));

  // Featured repositories to showcase
  const featuredRepos = [
    { owner: "nodejs", repo: "node" },
    { owner: "webpack", repo: "webpack" },
    { owner: "webpack", repo: "webpack-dev-server" },
    { owner: "stylelint", repo: "stylelint" },
    { owner: "hiroppy", repo: "fusuma" },
    { owner: "hiroppy", repo: "web-app-template" },
  ];

  // Get repository information
  const repositories = await Promise.allSettled(
    featuredRepos.map(async ({ owner, repo }) => {
      try {
        return await getRepositoryInfo(owner, repo);
      } catch (error) {
        console.error(`Failed to fetch info for ${owner}/${repo}:`, error);
        return null;
      }
    }),
  );

  const repoData = repositories
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((repo) => repo !== null);

  const socialLinks = [
    { href: sns.github, title: "GitHub", icon: "mdi:github" },
    { href: sns.twitter, title: "X (Twitter)", icon: "mdi:twitter" },
    { href: sns.linkedin, title: "LinkedIn", icon: "mdi:linkedin" },
    { href: sns.facebook, title: "Facebook", icon: "mdi:facebook" },
    { href: sns.connpass, title: "Connpass", icon: "mdi:account-group" },
  ];

  const quickLinks = [
    { href: site.company, title: "Coder Penguin", icon: "mdi:office-building" },
    { href: site.podcast, title: "Mozaic.fm", icon: "mdi:podcast" },
    { href: site.blog, title: "Blog", icon: "mdi:post" },
    { href: site.resume, title: "Resume", icon: "mdi:file-document-outline" },
  ];

  return (
    <SectionContainer>
      <Section title="Profile" headingLevel="h1">
        <p className="text-text-main text-lg leading-[1.8] whitespace-pre-line">
          {profile}
        </p>
      </Section>

      <Section title="Links">
        <div className="mb-8">
          <h3 className="text-text-sub mb-3 text-base font-medium">Social</h3>
          <ListContainer className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, title, icon }) => (
              <li key={href}>
                <Link href={href} icon={icon} variant="button">
                  {title}
                </Link>
              </li>
            ))}
          </ListContainer>
        </div>
        <div>
          <h3 className="text-text-sub mb-3 text-base font-medium">Other</h3>
          <ListContainer className="flex flex-wrap gap-3">
            {quickLinks.map(({ href, title, icon }) => (
              <li key={href}>
                <Link href={href} icon={icon} variant="button">
                  {title}
                </Link>
              </li>
            ))}
          </ListContainer>
        </div>
      </Section>

      <Section title="OSS Maintenance">
        <ProjectLinks projects={repoData} />
      </Section>

      <Section title="Community Activities">
        <div className="flex flex-col gap-12">
          {communityActivities.map(({ id, title, start, end, links }) => (
            <div key={id}>
              <div className="mb-4">
                <h3 className="text-text-main mb-1 text-base font-medium">
                  {title}
                </h3>
                <DateRange
                  start={start}
                  end={end}
                  variant="text"
                  isActive={!end}
                />
              </div>
              {links && links.length > 0 && (
                <ListContainer className="space-y-4">
                  {links
                    .sort((a: CommunityLink, b: CommunityLink) => {
                      const extractYear = (item: {
                        url: string;
                        title: string;
                      }) => {
                        const yearMatch = (item.url + " " + item.title).match(
                          /20(\d{2})/,
                        );
                        return yearMatch ? parseInt("20" + yearMatch[1]) : 0;
                      };
                      const yearA = extractYear(a);
                      const yearB = extractYear(b);
                      if (yearA && yearB && yearA !== yearB) {
                        return yearB - yearA;
                      }
                      return b.title.localeCompare(a.title);
                    })
                    .map((link: CommunityLink) => {
                      const yearMatch = (link.url + " " + link.title).match(
                        /20(\d{2})/,
                      );
                      const year = yearMatch ? "20" + yearMatch[1] : undefined;
                      return (
                        <li key={link.url}>
                          <CommunityActivityCard link={link} year={year} />
                        </li>
                      );
                    })}
                </ListContainer>
              )}
            </div>
          ))}
        </div>
      </Section>
    </SectionContainer>
  );
}
