export const TITLE = "Media & Activities";
export const KINDS = ["all", "articles", "talks", "podcasts"] as const;

export type Kind = (typeof KINDS)[number];
