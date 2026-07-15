# Build stage
FROM node:22 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files and build Angular application
COPY . .
RUN npm run build

# Production server stage (serve app via Nginx)
FROM nginx:alpine
COPY --from=build /app/dist/clientApp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]