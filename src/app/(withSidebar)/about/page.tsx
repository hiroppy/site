"use cache";

import meta from "hiroppy/generated/meta.json";
import { Link } from "../../_components/Link";
import { ListContainer } from "../../_components/ListContainer";
import { Repositories } from "../../_components/Repositories";
import { Section } from "../../_components/Section";
import { SectionContainer } from "../../_components/SectionContainer";
import { createMetadata } from "../../_utils/metadata";
import { Communities } from "./_components/Communities";

export const metadata = createMetadata({
  path: "/about",
  title: "About - hiroppy",
  description:
    "JavaScript Engineer, Speaker, OSS Contributor, Community Organizer",
});

export default async function Page() {
  const socialLinks = [
    { href: meta.sns.github, title: "GitHub", icon: "mdi:github" },
    { href: meta.sns.twitter, title: "X (Twitter)", icon: "mdi:twitter" },
    { href: meta.sns.linkedin, title: "LinkedIn", icon: "mdi:linkedin" },
    { href: meta.sns.facebook, title: "Facebook", icon: "mdi:facebook" },
    { href: meta.sns.connpass, title: "Connpass", icon: "mdi:account-group" },
  ];

  const quickLinks = [
    {
      href: meta.site.company,
      title: "Coder Penguin",
      icon: "mdi:office-building",
    },
    { href: meta.site.podcast, title: "Mozaic.fm", icon: "mdi:podcast" },
    { href: meta.site.blog, title: "Blog", icon: "mdi:post" },
    {
      href: meta.site.resume,
      title: "Resume",
      icon: "mdi:file-document-outline",
    },
  ];

  return (
    <SectionContainer>
      <Section title="Profile" headingLevel="h1">
        <p className="text-text-main text-lg leading-[1.8] whitespace-pre-line">
          {meta.profile}
        </p>
      </Section>
      <Section title="Links" className="space-y-8">
        {(
          [
            ["Social", socialLinks],
            ["Other", quickLinks],
          ] as const
        ).map(([title, links]) => (
          <div key={title}>
            <h3 className="text-text-sub mb-3 text-base font-medium">
              {title}
            </h3>
            <ListContainer className="flex flex-wrap gap-3">
              {links.map(({ href, title: linkTitle, icon }) => (
                <li key={href}>
                  <Link href={href} icon={icon} variant="button">
                    {linkTitle}
                  </Link>
                </li>
              ))}
            </ListContainer>
          </div>
        ))}
      </Section>
      <Section title="OSS Maintenance">
        <Repositories
          repos={[
            { owner: "nodejs", repo: "node" },
            { owner: "webpack", repo: "webpack" },
            { owner: "webpack", repo: "webpack-dev-server" },
            { owner: "stylelint", repo: "stylelint" },
            { owner: "hiroppy", repo: "fusuma" },
            { owner: "hiroppy", repo: "web-app-template" },
          ]}
        />
      </Section>
      <Section title="Community Activities">
        <Communities communities={meta.community} />
      </Section>
    </SectionContainer>
  );
}
