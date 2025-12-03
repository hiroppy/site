"use cache";

import history from "hiroppy/generated/jobs.json";
import { Section } from "../../_components/Section";
import { SectionContainer } from "../../_components/SectionContainer";
import { createMetadata } from "../../_utils/metadata";
import { JobExperience } from "./_components/JobExperience";
import { SkillsSection } from "./_components/SkillsSection";

export const metadata = createMetadata({
  path: "/jobs",
  title: "Skills & Work Experience",
  description: "技術スキル、職務経歴、プロジェクト履歴",
});

export default function JobsPage() {
  const parsedMainJobs = (history as any).main;
  const parsedSideJobs = (history as any).side;

  return (
    <SectionContainer>
      <Section title="Technical Skills" headingLevel="h1">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-text-main text-lg leading-[1.8]">
            2008年頃からJavaScriptとCを使ってプログラミングを始め、4年間画像処理を研究し、ニコニコ生放送の動画最適化についても研究をしていました。
          </p>
          <p className="text-text-main text-lg leading-[1.8]">
            現在は、主にwebpack、Turborepo、Viteなどのツールを使ったWebパフォーマンスとフロントエンドインフラストラクチャの構築が専門です。Next.jsとGraphQLを2017年から利用しており、様々な製品開発を行っています。
          </p>
        </div>
        <SkillsSection
          sections={[
            {
              title: "JavaScript",
              previewCount: 6,
              items: [
                { title: "Node.js", from: 2011, maintainer: true },
                { title: "webpack", from: 2017, maintainer: true },
                { title: "TypeScript", from: 2016 },
                { title: "React", from: 2015 },
                { title: "Next.js", from: 2017 },
                {
                  title: "Gatsby",
                  from: 2017,
                  to: 2021,
                  maintainer: true,
                },
                { title: "Astro", from: 2022 },
                { title: "Apollo", from: 2017 },
                { title: "Nestjs", from: 2020 },
                { title: "ChakraUI", from: 2020, maintainer: true },
                { title: "TailwindCSS", from: 2019 },
                { title: "Redux", from: 2016, to: 2019 },
                { title: "Prisma", from: 2022 },
                { title: "Electron", from: 2017 },
                { title: "Vite", from: 2022 },
                { title: "jQuery", from: 2008, to: 2014 },
              ],
            },
            {
              title: "Others",
              previewCount: 5,
              items: [
                { title: "Go", from: 2022 },
                { title: "C, C++", from: 2008, to: 2015 },
                { title: "ActionScript", from: 2010, to: 2015 },
                { title: "Java", from: 2010, to: 2012 },
                { title: "OpenCV", from: 2014, to: 2015 },
                { title: "Boost", from: 2012, to: 2015 },
                { title: "GraphQL", from: 2017 },
                { title: "gRPC", from: 2020 },
                { title: "Terraform", from: 2022 },
                { title: "PostgreSQL", from: 2014 },
                { title: "DuckDB", from: 2022 },
              ],
            },
          ]}
        />
      </Section>

      <Section title="Work Experience (Public Only)">
        <JobExperience
          mainJobs={parsedMainJobs}
          sideJobs={parsedSideJobs}
          meta={(history as any).meta}
        />
      </Section>
    </SectionContainer>
  );
}
