# GHA でビルド済みの dist/ を配信する runtime 専用イメージ。
# ソースからのフルビルドは Dockerfile.full を参照。
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
