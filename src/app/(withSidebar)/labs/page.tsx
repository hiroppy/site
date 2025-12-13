import { MdRssFeed } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../../components/Card";
import { SectionContainer, Section } from "../../../components/Section";
import { Tag } from "../../../components/Tag";
import { createMetadata } from "../../../utils/metadata";
import { title, description } from "./_metadata";

export const metadata = createMetadata({
  path: "/labs",
  title,
  description,
});

const projects = [
  {
    title: "Feedle",
    description:
      "開発者向けの技術記事収集プラットフォーム。様々なソースから技術記事を集約し、キュレーションします。",
    link: "/labs/feedle/frontend",
    tags: ["JavaScript", "AI"],
    icon: (
      <MdRssFeed
        className="text-2xl text-white"
        size={24}
        aria-hidden="true"
        focusable="false"
      />
    ),
    color: "bg-orange-700/80",
  },
];

export default async function LabsPage() {
  return (
    <SectionContainer className="h-screen">
      <Section title="Current Projects" headingLevel="h1">
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card
              key={project.link}
              variant="interactive"
              link={{ href: project.link }}
              className="group"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br ${project.color}`}
                  >
                    {project.icon}
                  </div>
                </div>
                <CardTitle className="mb-3 text-xl">{project.title}</CardTitle>
                <CardDescription className="mb-4 grow">
                  {project.description}
                </CardDescription>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </SectionContainer>
  );
}
