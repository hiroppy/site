FROM mcr.microsoft.com/playwright:v1.52.0 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Skip Puppeteer's Chromium download since we're using Playwright
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Force a specific font configuration for tests
ENV PLAYWRIGHT_FONT_DISPLAY=same-as-local
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY . /app
WORKDIR /app

RUN npm run setup

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
# Install fonts to ensure consistent rendering
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-color-emoji

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD ["pnpm", "test:vrt:update"]
