FROM mcr.microsoft.com/playwright:v1.58.0-noble

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PLAYWRIGHT_FONT_DISPLAY=same-as-local
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000

COPY . /app
WORKDIR /app

# Install fonts to ensure consistent rendering
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-color-emoji
RUN npm run setup
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

CMD ["pnpm", "test:vrt:ci:update"]
