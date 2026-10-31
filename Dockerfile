# syntax=docker/dockerfile:1

##########################################################################
# Stage 1: install dependencies
##########################################################################
FROM node:22-slim AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# There is no pnpm-workspace.yaml, so project deps resolve from package.json/lockfile.
RUN pnpm install --frozen-lockfile

##########################################################################
# Stage 2: build the Vite app
##########################################################################
FROM node:22-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# VITE_* vars are inlined at build time.
# Pass the production API URL via --build-arg when building, e.g.:
#   --build-arg VITE_API_BASE_URL=https://api.mix-food.io.vn
ARG VITE_API_BASE_URL=https://api.mix-food.io.vn
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_SITE_URL=https://mix-food.io.vn
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN pnpm build

##########################################################################
# Stage 3: production runtime (static site served by nginx)
##########################################################################
FROM nginx:1.27-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
