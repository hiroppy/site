import meta from "hiroppy/generated/meta.json";
import { FaGithub, FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdBusiness, MdGroup, MdPodcasts } from "react-icons/md";
import { Link } from "../../../components/Link";
import { ListContainer } from "../../../components/ListContainer";
import { Repositories } from "../../../components/Repositories";
import { SectionContainer, Section } from "../../../components/Section";
import { createMetadata } from "../../../utils/metadata";
import { Communities } from "./_components/Communities";
import { description, title } from "./_metadata";

export const metadata = createMetadata({
  path: "/about",
  title,
  description,
});

const socialLinks = [
  {
    href: meta.sns.github,
    title: "GitHub",
    icon: <FaGithub aria-hidden="true" focusable="false" />,
  },
  {
    href: meta.sns.twitter,
    title: "X (Twitter)",
    icon: <FaXTwitter aria-hidden="true" focusable="false" />,
  },
  {
    href: meta.sns.linkedin,
    title: "LinkedIn",
    icon: <FaLinkedin aria-hidden="true" focusable="false" />,
  },
  {
    href: meta.sns.facebook,
    title: "Facebook",
    icon: <FaFacebook aria-hidden="true" focusable="false" />,
  },
] as const;

const quickLinks = [
  {
    href: meta.site.company,
    title: "Coder Penguin",
    icon: <MdBusiness aria-hidden="true" focusable="false" />,
  },
  {
    href: meta.site.podcast,
    title: "Mozaic.fm",
    icon: <MdPodcasts aria-hidden="true" focusable="false" />,
  },
  {
    href: meta.sns.connpass,
    title: "Connpass",
    icon: <MdGroup aria-hidden="true" focusable="false" />,
  },
] as const;

const repos = [
  { owner: "nodejs", repo: "node" },
  { owner: "webpack", repo: "webpack" },
  { owner: "webpack", repo: "webpack-dev-server" },
  { owner: "stylelint", repo: "stylelint" },
  { owner: "hiroppy", repo: "fusuma" },
  { owner: "hiroppy", repo: "web-app-template" },
] as const;

export default async function Page() {
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
        <Repositories repos={repos} />
      </Section>
      <Section title="Community Activities">
        <Communities />
      </Section>
    </SectionContainer>
  );
}
