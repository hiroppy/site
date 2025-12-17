import { describe, expect, it } from "vitest";
import { getFileExtension, getIconForFile, languageIcons } from "./fileIcons";

describe("fileIcons", () => {
  describe("getFileExtension", () => {
    it("extracts common extensions", () => {
      expect(getFileExtension("file.ts")).toBe("ts");
      expect(getFileExtension("app.tsx")).toBe("tsx");
      expect(getFileExtension("style.css")).toBe("css");
      expect(getFileExtension("script.js")).toBe("js");
      expect(getFileExtension("component.jsx")).toBe("jsx");
    });

    it("handles multiple dots", () => {
      expect(getFileExtension("config.test.ts")).toBe("ts");
      expect(getFileExtension("archive.tar.gz")).toBe("gz");
      expect(getFileExtension("some.file.name.tsx")).toBe("tsx");
    });

    it("handles files without extension", () => {
      expect(getFileExtension("Dockerfile")).toBe("");
      expect(getFileExtension("README")).toBe("");
      expect(getFileExtension("Makefile")).toBe("");
    });

    it("handles hidden files", () => {
      expect(getFileExtension(".gitignore")).toBe("gitignore");
      expect(getFileExtension(".env")).toBe("env");
      expect(getFileExtension(".prettierrc")).toBe("prettierrc");
    });

    it("handles edge cases", () => {
      expect(getFileExtension("")).toBe("");
      expect(getFileExtension(".")).toBe("");
      expect(getFileExtension("..")).toBe("");
      expect(getFileExtension("...")).toBe("");
    });

    it("returns lowercase extension", () => {
      expect(getFileExtension("FILE.TS")).toBe("ts");
      expect(getFileExtension("App.TSX")).toBe("tsx");
      expect(getFileExtension("Style.CSS")).toBe("css");
    });
  });

  describe("getIconForFile", () => {
    it("returns typescript icon for .ts files", () => {
      expect(getIconForFile("index.ts")).toBe("typescript");
      expect(getIconForFile("types.ts")).toBe("typescript");
    });

    it("returns typescript icon for .tsx files", () => {
      expect(getIconForFile("App.tsx")).toBe("typescript");
      expect(getIconForFile("Component.tsx")).toBe("typescript");
    });

    it("returns javascript icon for .js files", () => {
      expect(getIconForFile("app.js")).toBe("javascript");
      expect(getIconForFile("script.js")).toBe("javascript");
    });

    it("returns javascript icon for .jsx files", () => {
      expect(getIconForFile("Component.jsx")).toBe("javascript");
    });

    it("returns console icon for shell scripts", () => {
      expect(getIconForFile("deploy.sh")).toBe("console");
      expect(getIconForFile("script.bash")).toBe("console");
      expect(getIconForFile("setup.zsh")).toBe("console");
    });

    it("returns css icon for stylesheet files", () => {
      expect(getIconForFile("styles.css")).toBe("css");
      expect(getIconForFile("theme.scss")).toBe("css");
      expect(getIconForFile("main.sass")).toBe("css");
    });

    it("returns markdown icon for markdown files", () => {
      expect(getIconForFile("README.md")).toBe("markdown");
      expect(getIconForFile("article.mdx")).toBe("markdown");
    });

    it("returns docker icon for docker files", () => {
      expect(getIconForFile("Dockerfile")).toBe("file-code"); // No extension
      expect(getIconForFile("app.docker")).toBe("docker");
      expect(getIconForFile("compose.dockerfile")).toBe("docker");
    });

    it("returns git icon for git files", () => {
      expect(getIconForFile(".gitignore")).toBe("git");
      expect(getIconForFile("config.git")).toBe("git");
    });

    it("returns default icon for unknown extensions", () => {
      expect(getIconForFile("config.toml")).toBe("file-code");
      expect(getIconForFile("data.xml")).toBe("file-code");
      expect(getIconForFile("package.lock")).toBe("file-code");
    });

    it("returns default icon for files without extension", () => {
      expect(getIconForFile("Makefile")).toBe("file-code");
      expect(getIconForFile("README")).toBe("file-code");
    });
  });

  describe("languageIcons mapping", () => {
    it("includes all CodeGroup languages", () => {
      expect(languageIcons.javascript).toBe("javascript");
      expect(languageIcons.typescript).toBe("typescript");
      expect(languageIcons.bash).toBe("console");
      expect(languageIcons.json).toBe("json");
      expect(languageIcons.html).toBe("html");
      expect(languageIcons.css).toBe("css");
    });

    it("includes extended file types", () => {
      expect(languageIcons.tsx).toBe("typescript");
      expect(languageIcons.jsx).toBe("javascript");
      expect(languageIcons.mdx).toBe("markdown");
      expect(languageIcons.scss).toBe("css");
      expect(languageIcons.sass).toBe("css");
    });

    it("includes special files", () => {
      expect(languageIcons.dockerfile).toBe("docker");
      expect(languageIcons.gitignore).toBe("git");
    });

    it("has default fallback", () => {
      expect(languageIcons.default).toBe("file-code");
    });
  });
});
