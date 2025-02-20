FROM mcr.microsoft.com/playwright:v1.50.1

WORKDIR /work/

COPY . .

RUN npm run corepack
RUN pnpm install

CMD ["pnpm", "test", "--", "-u"]
