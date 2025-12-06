"use cache";

import { Card } from "../../_components/Card";
import { CardContent } from "../../_components/CardContent";
import { CardDescription } from "../../_components/CardDescription";
import { CardTitle } from "../../_components/CardTitle";
import { Icon } from "../../_components/Icon";
import { Section } from "../../_components/Section";
import { SectionContainer } from "../../_components/SectionContainer";
import { createMetadata } from "../../_utils/metadata";

export const metadata = createMetadata({
  path: "/labs",
  title: "Labs - hiroppy",
  description: "実験的なプロジェクトとアイデア",
});

const projects = [
  {
    title: "Feedle",
    description:
      "開発者向けの技術記事収集プラットフォーム。様々なソースから技術記事を集約し、キュレーションします。",
    link: "/labs/feedle/frontend",
    icon: "mdi:rss",
    tags: ["JavaScript", "AI"],
    color: "from-blue-500 to-purple-600",
  },
];

export default async function LabsPage() {
  return (
    <SectionContainer>
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
                    <Icon
                      icon={project.icon}
                      className="text-2xl text-white"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <CardTitle className="mb-3 text-xl">{project.title}</CardTitle>
                <CardDescription className="mb-4 grow">
                  {project.description}
                </CardDescription>

                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
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
