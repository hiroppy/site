FROM mcr.microsoft.com/playwright:v1.52.0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PLAYWRIGHT_FONT_DISPLAY=same-as-local
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY . /app
WORKDIR /app

# Install fonts to ensure consistent rendering
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-color-emoji
RUN npm run setup
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

CMD ["pnpm", "test:vrt:update"]
