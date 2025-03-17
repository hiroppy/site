FROM mcr.microsoft.com/playwright:v1.51.1

WORKDIR /work/
COPY . .

# Install fonts to ensure consistent rendering
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-color-emoji

RUN npm i corepack -g
RUN npm run corepack
RUN pnpm install

# Force a specific font configuration for tests
ENV PLAYWRIGHT_FONT_DISPLAY=same-as-local

CMD ["pnpm", "test", "--", "-u"]
