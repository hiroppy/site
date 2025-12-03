# Development Guidelines for hiroppy/site

## Commands

- **Setup**: `pnpm setup` (git hooks and corepack setup)
- **Build/Run**: `pnpm build`, `pnpm build:local` (test build), `pnpm dev`, `pnpm start`
- **Lint/Format**: `pnpm fmt` (prettier), `pnpm fmt:check`, `pnpm lint` (knip dependency analysis)
- **Test**:
  - **Prerequisites**: Run `pnpm build:local` before running tests
  - **Unit**: `pnpm test` (vitest), `pnpm test:watch` (vitest watch mode)
  - **A11y**: `pnpm test:a11y` (playwright axe-core)
  - **VRT**: `pnpm test:vrt:update` (update snapshots via Docker), `pnpm test:vrt:ci` (run VRT tests), `pnpm test:vrt:ci:update` (update snapshots in CI)
  - **VRT Specific**: `pnpm test:vrt:ci:pages`, `pnpm test:vrt:ci:components`
  - **Performance**: `pnpm lh` (lighthouse)
- **Other**: `pnpm copy-images` (copy hiroppy package images), `pnpm index` (update Algolia search), `pnpm generate:feedle-og` (generate OG images), `pnpm docker:clean`

## Code Style

- **Framework**: Next.js 16 (App Router) with React 19, TypeScript, and Tailwind CSS v4
- **Formatting**: Prettier with Tailwind plugin (`prettier-plugin-tailwindcss`)
- **TypeScript**: Strict mode with null checks, ESNext modules, target ES2022
- **Imports**: ESM modules, prefer named exports
- **Naming**: Descriptive, camelCase for variables/functions, PascalCase for components
- **Component Structure**: React/TSX components (.tsx), MDX for content (.mdx)
- **Error Handling**: Explicit null checks, use TypeScript guards
- **CSS**: Tailwind utility classes with `clsx` and `cn` helpers, minimal custom CSS
- **Pre-commit**: Runs Prettier via lefthook before commits

## Environment Variables

- **GITHUB_TOKEN**: GitHub API token for accessing repository data
- **ALGOLIA_ADMIN_KEY**: Algolia admin API key for indexing
- **NEXT_PUBLIC_ALGOLIA_APPLICATION_ID**: Algolia application ID (public)
- **NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY**: Algolia search-only API key (public)
- **FEEDLE_API_URL**: Feedle API base URL (default: `http://localhost:8787/api/v1`)
- **FEEDLE_API_TOKEN**: Feedle API authentication token

Configure these in `.env` file for local development. See `.env.example` for reference.

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

```bash [pnpm]
pnpm add package-name
```

```bash [yarn]
yarn add package-name
```

:::
````

The remark plugin automatically imports `CodeGroup` and wraps each fenced code block in a `<div class="code-group-panel">` with `data-label`, `data-icon`, and `data-language` attributes, so you don't need a separate panel component.

---

Created for agentic coding assistants working in this repository
