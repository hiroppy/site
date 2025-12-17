import { type IconType } from "react-icons";
import { MdCode, MdDataObject, MdFolder, MdTerminal } from "react-icons/md";
import {
  SiCss3,
  SiDocker,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiTypescript,
} from "react-icons/si";

export const languageIcons = {
  javascript: "javascript",
  js: "javascript",
  jsx: "javascript",
  typescript: "typescript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  scss: "css",
  sass: "css",
  bash: "console",
  shell: "console",
  sh: "console",
  zsh: "console",
  json: "json",
  yaml: "file-code",
  yml: "file-code",
  markdown: "markdown",
  md: "markdown",
  mdx: "markdown",
  graphql: "graphql",
  docker: "docker",
  dockerfile: "docker",
  git: "git",
  gitignore: "git",
  default: "file-code",
} as const;

type LanguageIconsKeys = keyof typeof languageIcons;
export type LanguageIconValues = (typeof languageIcons)[LanguageIconsKeys];

export const iconMap: Record<LanguageIconValues | "folder", IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  html: SiHtml5,
  css: SiCss3,
  markdown: SiMarkdown,
  console: MdTerminal,
  json: MdDataObject,
  "file-code": MdCode,
  graphql: SiGraphql,
  docker: SiDocker,
  git: SiGit,
  folder: MdFolder,
};

/**
 * Extract file extension from filename
 * @param filename - The filename to extract extension from
 * @returns The file extension in lowercase, or empty string if no extension
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  if (lastDot === 0 && filename.length === 1) return ""; // "." only
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Get icon name for a given filename
 * @param filename - The filename to get icon for
 * @returns The icon name from languageIcons mapping
 */
export function getIconForFile(filename: string): LanguageIconValues {
  const ext = getFileExtension(filename);
  return (
    (languageIcons[ext as LanguageIconsKeys] as LanguageIconValues) ||
    languageIcons.default
  );
}
