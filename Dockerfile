FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
RUN npm run build

FROM nginx:1.27-alpine

# nginx.conf terminates TLS itself (certs mounted at /etc/nginx/certs).
# Behind Traefik, build with --build-arg NGINX_CONF=frontend/nginx.proxied.conf
# so this image serves plain HTTP on :80 and lets Traefik own the certificates.
ARG NGINX_CONF=frontend/nginx.conf
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
