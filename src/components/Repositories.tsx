"use cache";

import { cacheLife } from "next/cache";
import { MdStar } from "react-icons/md";
import { getRepositoryInfo } from "../utils/github";
import { Image } from "./Image";
import { Link } from "./Link";
import { ListContainer } from "./ListContainer";

type Props = {
  repos: readonly {
    owner: string;
    repo: string;
  }[];
};

export async function Repositories({ repos }: Props) {
  cacheLife("weeks");

  const repositories = await Promise.allSettled(
    repos.map(async ({ owner, repo }) => {
      try {
        return await getRepositoryInfo(owner, repo);
      } catch (error) {
        console.error(`Failed to fetch info for ${owner}/${repo}:`, error);
        return null;
      }
    }),
  );
  const res = repositories
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((repo) => repo !== null);

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return `${count}`;
  };

  return (
    <ListContainer className="space-y-6">
      {res.map((project) => (
        <li key={project.url} className="block">
          <Link
            href={project.url}
            unstyled
            className="text-text-main block no-underline hover:opacity-60"
          >
            <span className="flex items-center justify-between text-xl leading-normal font-normal">
              <span className="inline-flex items-center gap-2">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={`${project.name} icon`}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                    lazy
                  />
                )}
                <span className="inline-flex items-center gap-1">
                  {project.name}
                </span>
              </span>
              <span
                className="text-accent ml-3 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-sm font-medium"
                data-testid="github-star-count"
              >
                <MdStar size={16} aria-hidden="true" focusable="false" />
                {formatStars(project.stars)}
              </span>
            </span>
            {project.description && (
              <span className="text-text-sub mt-1 block text-sm">
                {project.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ListContainer>
  );
}
