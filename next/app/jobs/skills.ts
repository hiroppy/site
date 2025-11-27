export type SkillItem = {
  title: string;
  from: number;
  to?: number;
};

export type SkillCategory = {
  title: string;
  colorClass: string;
  items: SkillItem[];
};

export const skills: SkillCategory[] = [
  {
    title: "JavaScript",
    colorClass: "bg-yellow-500",
    items: [
      { title: "Node.js 👷", from: 2011 },
      { title: "TypeScript", from: 2016 },
      { title: "React", from: 2015 },
      { title: "Next.js", from: 2017 },
      { title: "Gatsby 👷", from: 2017, to: 2021 },
      { title: "Astro", from: 2022 },
      { title: "Apollo", from: 2017 },
      { title: "Nestjs", from: 2020 },
      { title: "Mui", from: 2021 },
      { title: "ChakraUI 👷", from: 2020 },
      { title: "TailwindCSS", from: 2019 },
      { title: "Redux", from: 2016, to: 2019 },
      { title: "Prisma", from: 2022 },
      { title: "NextAuth.js", from: 2022 },
      { title: "Electron", from: 2017 },
      { title: "webpack 👷", from: 2017 },
      { title: "Vite", from: 2022 },
      { title: "jQuery", from: 2008, to: 2014 },
    ],
  },
  {
    title: "Others",
    colorClass: "bg-purple-500",
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
];
