# Render / GHA: ソースから SSG ビルドして nginx で配信する。
# Vite content hash を GHA（Pages へ上げる _astro）と Render で揃えるため、
# どちらもこの Dockerfile の build ステージ（Alpine）だけで astro build する。
# package-lock.json に固定した依存ツリーを厳密に使うため npm ci を使う。
FROM node:24.10.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG PUBLIC_ASSET_BASE_URL
ARG PUBLIC_SITE_URL
ARG RENDER_EXTERNAL_URL
ARG DATABASE_URL
ARG DEPLOY_ENV
# assetsPrefix 無し HTML と runtime の /_astro 削除が食い違わないよう必須化する
RUN test -n "$PUBLIC_ASSET_BASE_URL"
ENV PUBLIC_ASSET_BASE_URL=$PUBLIC_ASSET_BASE_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV RENDER_EXTERNAL_URL=$RENDER_EXTERNAL_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DEPLOY_ENV=$DEPLOY_ENV
RUN npm run build

# GHA が Pages へ上げる dist を書き出す用（docker build --target export -o ...）
FROM scratch AS export
COPY --from=build /app/dist /dist

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# JS/CSS は Cloudflare Pages（assetsPrefix）から配信。Render 上の複製は削除する。
RUN rm -rf /usr/share/nginx/html/_astro
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
