# Development Guidelines for hiroppy/site

## Commands

- **Setup**: `pnpm setup` (git hooks and corepack setup)
- **Build/Run**: `pnpm build` (webpack mode), `pnpm dev` (webpack mode), `pnpm start` (production mode)
- **Lint/Format**: `pnpm fmt` (prettier), `pnpm fmt:check`, `pnpm lint` (knip dependency analysis)
- **Type Check**: `pnpm typecheck` (next typegen + tsc)
- **Test**:
  - **Prerequisites**: Run `pnpm build` before running tests
  - **Unit**: `pnpm test` (vitest), `pnpm test:watch` (vitest watch mode)
  - **A11y**: `pnpm test:a11y` (playwright axe-core)
  - **VRT**: `pnpm test:vrt:update` (update snapshots via Docker), `pnpm test:vrt:ci` (run VRT tests), `pnpm test:vrt:ci:update` (update snapshots in CI)
  - **VRT Specific**: `pnpm test:vrt:ci:pages`, `pnpm test:vrt:ci:components`
  - **Performance**: `pnpm lh` (lighthouse)
- **Other**: `pnpm copy-images` (copy hiroppy package images), `pnpm index` (update Algolia search), `pnpm docker:clean`

## Code Style

- **Framework**: Next.js 16.0.10 (App Router) with React 19.2.0, TypeScript 5.9.3, and Tailwind CSS v4.1.17
- **Node.js**: v24.11.1
- **Package Manager**: pnpm 10.24.0
- **Formatting**: Prettier with Tailwind plugin (`prettier-plugin-tailwindcss`)
- **TypeScript**: Strict mode with null checks, ESNext modules, target ES2022, bundler module resolution
- **Imports**: ESM modules, prefer named exports
- **Naming**: Descriptive, camelCase for variables/functions, PascalCase for components
- **Component Structure**: React/TSX components (.tsx), MDX for content (.mdx)
- **Error Handling**: Explicit null checks, use TypeScript guards
- **CSS**: Tailwind utility classes with `clsx` and `tailwind-merge` (cn helper), minimal custom CSS
- **Pre-commit**: Runs Prettier via lefthook before commits
- **React Compiler**: Enabled (`reactCompiler: true`)
- **Cache Components**: Enabled with 1-week revalidation (`cacheComponents: true`)
- **Typed Routes**: Enabled (`typedRoutes: true`)
- **Build**: Webpack mode (Turbopack disabled due to MDX custom plugin incompatibility)

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

The remark plugin automatically imports `CodeGroup` and wraps each fenced code block in a `<div className="code-group-panel">` with `data-label`, `data-icon`, and `data-language` attributes, so you don't need a separate panel component.

## Writing Guidelines

When writing blog articles:
- **Always refer to `.claude/context/WRITING.md`** for comprehensive style guidelines, tone, structure templates, and language patterns
- **Pick several recent articles at random** from `src/content/blog/` and mimic their writing style as closely as possible to maintain consistency

---

Created for agentic coding assistants working in this repository
