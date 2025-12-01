export function getPathAndOutputDirname(url: string) {
  const urlPath = url.replace("http://localhost:3000", "");
  const output =
    urlPath === "/" || urlPath === ""
      ? "home"
      : urlPath.replace(/^\//, "").replace(/\//g, "-");

  return { output };
}
