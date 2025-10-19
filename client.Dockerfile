# Multi-stage build for React UI served via nginx
FROM node:18-alpine AS build
WORKDIR /ui
COPY client/package.json client/package-lock.json* ./client/
RUN npm install --prefix client
COPY client ./client
RUN npm run build --prefix client

FROM nginx:1.25-alpine
COPY --from=build /ui/client/build /usr/share/nginx/html
# Simple nginx config with proxy to api service
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
