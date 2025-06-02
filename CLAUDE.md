# Development Guidelines for hiroppy/site

## Commands

- **Build/Run**: `pnpm build`, `pnpm dev`, `pnpm preview`
- **Data**: `pnpm data:generate`, `pnpm cache`, `pnpm data:clean`
- **Lint/Format**: `pnpm fmt` (prettier), `pnpm fmt:check`
- **Typecheck**: `pnpm check` (astro check)
- **Test**: `pnpm test` (playwright), `pnpm test:update` (update snapshots)
- **Single test**: `npx playwright test tests/vrt.spec.ts -g "VRT: /blog"`
- **A11y/Performance**: `pnpm a11y` (playwright axe-core), `pnpm lh` (lighthouse)

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

Created for agentic coding assistants working in this repository
