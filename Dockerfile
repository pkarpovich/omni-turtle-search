ARG NODE_VERSION=22.14
ARG PNPM_VERSION=9.15


FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}


FROM base as deps

RUN --mount=type=bind,source=./package.json,target=package.json \
    --mount=type=bind,source=./pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile


FROM deps as extension-build

RUN --mount=type=bind,source=./package.json,target=package.json \
    --mount=type=bind,source=./pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build:web


FROM joseluisq/static-web-server:2-alpine

COPY --from=extension-build /usr/src/app/dist-web /var/public
EXPOSE 8080

