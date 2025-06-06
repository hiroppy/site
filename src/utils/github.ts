import { Octokit } from "octokit";

interface RepositoryInfo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  homepage: string | null;
  topics: string[];
  archived: boolean;
}

let octokit: Octokit | null = null;

function getOctokit() {
  if (!octokit) {
    const token = import.meta.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

/**
 * Get star count for a repository
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Promise<number> - Star count
 */
export async function getStarCount(owner: string, repo: string) {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    return new Intl.NumberFormat("ja-JP").format(data.stargazers_count);
  } catch (error) {
    console.error(`Failed to fetch star count for ${owner}/${repo}:`, error);
    return "0";
  }
}

/**
 * Get star counts for multiple repositories
 * @param repos - Array of repository names in "owner/repo" format
 * @returns Promise<Record<string, number>> - Object mapping repo names to star counts
 */

/**
 * Get repository information including star count
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Promise<RepositoryInfo> - Repository information
 */
export async function getRepositoryInfo(owner: string, repo: string) {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return {
      name: data.full_name,
      url: data.html_url,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      defaultBranch: data.default_branch,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      avatar: data.owner.avatar_url,
      homepage: data.homepage,
      topics: data.topics || [],
      archived: data.archived,
    };
  } catch (error) {
    console.error(
      `Failed to fetch repository info for ${owner}/${repo}:`,
      error,
    );
    throw error;
  }
}
