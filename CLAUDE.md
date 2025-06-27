# Development Guidelines for hiroppy/site

## Commands

- **Build/Run**: `pnpm build`, `pnpm dev`, `pnpm preview`
- **Data**: `pnpm data:generate`, `pnpm cache`, `pnpm data:clean`
- **Lint/Format**: `pnpm fmt` (prettier), `pnpm fmt:check`
- **Typecheck**: `pnpm check` (astro check)
- **Test**: `pnpm test` (playwright), `pnpm test:update` (update snapshots)
- **Single test**: `npx playwright test tests/vrt.spec.ts -g "VRT: /blog"`
- **A11y/Performance**: `test:a11y` (playwright axe-core), `pnpm lh` (lighthouse)

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

```bash [pnpm]
pnpm add package-name
```

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
