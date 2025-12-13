"use cache";

import jobs from "hiroppy/generated/jobs.json";
import { SectionContainer, Section } from "../../../components/Section";
import { createMetadata } from "../../../utils/metadata";
import { JobExperience } from "./_components/JobExperience";
import { SkillsSection } from "./_components/SkillsSection";
import { title, description } from "./_metadata";

export const metadata = createMetadata({
  path: "/jobs",
  title,
  description,
});

export default async function Page() {
  const currentYear = new Date().getFullYear();

  return (
    <SectionContainer>
      <Section title="Technical Skills" headingLevel="h1">
        <div className="mb-6 flex flex-col gap-2">
          {[
            "2008年頃からJavaScriptとCを使ってプログラミングを始め、会津大学で4年間画像処理を研究。",
            "Node.js、React、Next.js、バンドルアルゴリズムに興味があるが、最近はLLMを使ったアプリ開発が多め。",
            "一番好きな言語は、ActionScript 3.0。",
          ].map((text) => (
            <p key={text} className="text-text-main text-lg leading-[1.8]">
              {text}
            </p>
          ))}
        </div>
        <SkillsSection
          currentYear={currentYear}
          sections={[
            {
              title: "JavaScript",
              previewCount: 5,
              items: [
                { title: "Node.js", from: 2011, maintainer: true },
                { title: "webpack", from: 2017, maintainer: true },
                { title: "TypeScript", from: 2016 },
                { title: "Next.js", from: 2017 },
                { title: "React", from: 2015 },
                { title: "TailwindCSS", from: 2019 },
                { title: "Vite", from: 2022 },
                { title: "Astro", from: 2022 },
                { title: "Apollo", from: 2017 },
                { title: "Nestjs", from: 2020 },
                { title: "ChakraUI", from: 2020, maintainer: true },
                { title: "Redux", from: 2016, to: 2019 },
                { title: "Prisma", from: 2022 },
                { title: "Electron", from: 2017 },
                {
                  title: "Gatsby",
                  from: 2017,
                  to: 2021,
                  maintainer: true,
                },
                { title: "jQuery", from: 2008, to: 2014 },
              ],
            },
            {
              title: "Other",
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
          mainJobs={jobs.main}
          sideJobs={jobs.side}
          meta={jobs.meta}
        />
      </Section>
    </SectionContainer>
  );
}
