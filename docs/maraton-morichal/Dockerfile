# Etapa 1: compilar Angular (aquí sí hace falta Node)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: solo los archivos compilados, servidos por Nginx (sin Node, imagen liviana, usuario sin privilegios)
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/maraton-morichal/browser /usr/share/nginx/html
EXPOSE 8080
