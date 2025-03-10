FROM mcr.microsoft.com/playwright:v1.51.0

WORKDIR /work/
COPY . .

RUN npm i corepack -g
RUN npm run corepack
RUN pnpm install

CMD ["pnpm", "test", "--", "-u"]
