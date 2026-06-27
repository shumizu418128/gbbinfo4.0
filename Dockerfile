FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# SSG ビルドはビルド時に Supabase へ接続し、全ページを静的生成する。
ARG VITE_ASSET_BASE_URL
ARG DATABASE_URL
ARG DEPLOY_ENV
ENV VITE_ASSET_BASE_URL=$VITE_ASSET_BASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DEPLOY_ENV=$DEPLOY_ENV
RUN npm run build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
