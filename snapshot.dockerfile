FROM mcr.microsoft.com/playwright:v1.47.1

WORKDIR /work/

COPY . .

RUN npm run corepack
RUN pnpm install

CMD ["pnpm", "test", "--", "-u"]
