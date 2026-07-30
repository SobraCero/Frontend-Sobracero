
FROM node:22-alpine AS build
WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install


COPY . .
RUN npm run build-only


FROM nginx:alpine

# Copiamos la aplicación compilada (dist) hacia el directorio público de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 dentro del contenedor
EXPOSE 80
