import { MdCalculate, MdRssFeed, MdShowChart } from "react-icons/md";
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
    title: "mf-dashboard",
    description: "MoneyForward Meを自動化、可視化。",
    link: "https://hiroppy.github.io/mf-dashboard/",
    tags: ["Asset Management"],
    icon: (
      <MdShowChart
        className="text-2xl text-white"
        size={24}
        aria-hidden="true"
        focusable="false"
      />
    ),
    color: "bg-emerald-700/80",
  },
  {
    title: "資産切り崩しシミュレーター",
    description:
      "毎月の積立額や初期投資額、運用期間などの条件から、目標金額までの道のりをシミュレーションできます。年齢を入力すると年金受給などを考慮した将来設計がしやすくなり、さらに5,000回のモンテカルロ・シミュレーションによって資産が枯渇する確率も算出します。",
    link: "https://asset-melt.party/",
    tags: ["Asset Management", "Simulation"],
    icon: (
      <MdCalculate
        className="text-2xl text-white"
        size={24}
        aria-hidden="true"
        focusable="false"
      />
    ),
    color: "bg-sky-700/80",
  },
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
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${project.color}`}
                  >
                    {project.icon}
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </div>
                <CardDescription>{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
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
