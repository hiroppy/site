import { exec } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { baseImageOutputPath } from "./utils.mjs";

const execPromisify = promisify(exec);

try {
  // squooshが対応していない
  // https://blog.hiroppy.me/entry/nodefest2017
  await execPromisify(
    `rm ${join(
      baseImageOutputPath,
      "bm9kZWZlc3QuanAvMjAxNy9pbWcvb2dpbWFnZS5wbmc=.png"
    )}`
  );
} catch {}

await execPromisify(
  `npx squoosh-cli --resize '{\"width\": 150}' --webp auto -d ${baseImageOutputPath} ${join(
    baseImageOutputPath,
    "*"
  )}`
);

try {
  await execPromisify(`rm ${join(baseImageOutputPath, "*.png")}`);
} catch {}
try {
  await execPromisify(`rm ${join(baseImageOutputPath, "*.jpg")}`);
} catch {}
