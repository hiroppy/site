FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /work/

COPY . .

RUN npm run corepack
RUN pnpm install

CMD ["npm", "test", "--", "-u"]
