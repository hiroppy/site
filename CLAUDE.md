# Development Guidelines for hiroppy/site

## Commands

- **Setup**: `pnpm setup` (git hooks and corepack setup)
- **Build/Run**: `pnpm build`, `pnpm build:local` (test build), `pnpm dev`, `pnpm preview`
- **Lint/Format**: `pnpm fmt` (prettier), `pnpm fmt:check`, `pnpm lint` (knip dependency analysis), `pnpm textlint` (check blog posts), `pnpm textlint:fix` (auto-fix blog posts)
- **Typecheck**: `pnpm check` (astro check)
- **Test**:
  - **Prerequisites**: Run `pnpm build:local` before running tests
  - **A11y**: `pnpm test:a11y` (playwright axe-core)
  - **VRT**: `pnpm test:vrt:update` (update snapshots via Docker), `pnpm test:vrt:ci` (run VRT tests)
  - **VRT Specific**: `pnpm test:vrt:ci:pages`, `pnpm test:vrt:ci:components`
  - **Performance**: `pnpm lh` (lighthouse)
- **Other**: `pnpm index` (update Algolia search), `pnpm generate:feedle-og` (generate OG images), `pnpm docker:clean`

## Code Style

- **Framework**: Astro with TypeScript and Tailwind CSS
- **Formatting**: Prettier with Astro and Tailwind plugins
- **TypeScript**: Strict mode with null checks, ESNext modules
- **Imports**: ESM modules, prefer named exports
- **Naming**: Descriptive, camelCase for variables/functions, PascalCase for components
- **Component Structure**: Astro components (.astro), MDX for content (.mdx)
- **Error Handling**: Explicit null checks, use TypeScript guards
- **CSS**: Tailwind utility classes, minimal custom CSS
- **Pre-commit**: Runs Prettier via lint-staged before commits

## Environment Variables

- **FEEDLE_API_URL**: Feedle API base URL (default: `http://localhost:8787/api/v1`)
- **FEEDLE_API_TOKEN**: Feedle API authentication token
  - Configure in `.env` file for local development
  - See `.env.example` for reference

## Assets

- **Brand Images**: All images in `src/assets/images/brands/` should have 60% padding with centered content
  - Use ImageMagick: `magick input.png -background transparent -gravity center -extent 160%x160% output.png`

## Code Groups

Use VitePress-style syntax in MDX files (automatically imports components via remark plugin):

````mdx
::: code-group

```bash [npm]
npm install package-name
```
````

<br />
```bash [pnpm]
pnpm add package-name
```
<br />
```bash [yarn]
yarn add package-name
```

:::

````

Alternative manual component syntax:

```mdx
import CodeGroup from "../../components/CodeGroup.astro";
import CodeGroupPanel from "../../components/CodeGroupPanel.astro";

<CodeGroup defaultTab="npm">
  <CodeGroupPanel label="npm">
    ```bash
    npm install package-name
    ```
  </CodeGroupPanel>

  <CodeGroupPanel label="pnpm">
    ```bash
    pnpm add package-name
    ```
  </CodeGroupPanel>
</CodeGroup>
````

Created for agentic coding assistants working in this repository
