FROM node:14-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./dist/apps/blizz-data/package.json ./
RUN npm install --production
RUN npm install tslib

FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY ./dist/apps/blizz-data/main.js ./main.js

RUN addgroup -g 1001 -S nodejs
RUN adduser -u 1001 -S nodejs

USER nodejs

CMD ["node", "./main.js"]
