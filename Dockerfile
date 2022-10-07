FROM node:16 AS base
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml .yarn .env ./

FROM base AS dependencies
RUN yarn install

FROM dependencies AS build
COPY . .
RUN npm run build

FROM build AS release
EXPOSE 8000
CMD npm run start
