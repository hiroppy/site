import fs from "node:fs";
import path from "node:path";

// Resolve workspace root even when commands are run from next/ directly.
const cwd = process.cwd();
const repoRoot =
  process.env.WORKSPACE_ROOT && path.isAbsolute(process.env.WORKSPACE_ROOT)
    ? process.env.WORKSPACE_ROOT
    : cwd.endsWith(`${path.sep}next`)
      ? path.resolve(cwd, "..")
      : cwd;

export const generatedPaths = {
  root: path.join(repoRoot, "generated"),
  ogp: path.join(repoRoot, "generated", "ogp.json"),
};

export function readGeneratedJson<T>(fileName: string): T {
  const filePath = path.join(generatedPaths.root, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}
