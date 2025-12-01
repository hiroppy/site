import type { Repos } from "hiroppy/types";
import { Octokit } from "octokit";

let octokit: Octokit | null = null;

function getOctokit() {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

export async function getRepositoryInfo(
  owner: string,
  repo: string,
): Promise<
  Repos["hot"][number] & {
    stars: number;
  }
> {
  const octokit = getOctokit();
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return {
    name: data.full_name,
    url: data.html_url,
    description: data.description ?? "",
    language: data.language ?? "",
    stars: data.stargazers_count,
    // forks: data.forks_count,
    // openIssues: data.open_issues_count,
    // defaultBranch: data.default_branch,
    image: data.owner?.avatar_url,
    // createdAt: data.created_at,
    // updatedAt: data.updated_at,
    // avatar: data.owner.avatar_url,
    // homepage: data.homepage,
    // topics: data.topics || [],
    // archived: data.archived,
  };
}
