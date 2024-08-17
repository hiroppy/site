FROM mcr.microsoft.com/playwright:v1.46.1

WORKDIR /work/

COPY . .

RUN npm run corepack
RUN pnpm install

CMD ["pnpm", "test", "--", "-u"]
