FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_ASSET_BASE_URL
ENV VITE_ASSET_BASE_URL=$VITE_ASSET_BASE_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build ./build
COPY font ./font
CMD ["npm", "run", "start"]
