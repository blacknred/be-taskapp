FROM node:alpine AS base
ARG SERVICE_NAME
ENV SERVICE_NAME $SERVICE_NAME
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add g++ make py3-pip
RUN npm i -g pnpm
RUN pnpm add -g @nestjs/cli

FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# RUN nest build core
RUN nest build $SERVICE_NAME

FROM base AS deploy
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server
USER server
RUN pnpm prune --prod
COPY --from=build --chown=server:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=server:nodejs /usr/src/app/node_modules ./node_modules
CMD [ "node", "dist/apps/$SERVICE_NAME/main.js" ]
