# syntax=docker/dockerfile:1

############################################
# Frontend build stage
############################################
FROM node:20-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

############################################
# Frontend runtime stage
############################################
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
