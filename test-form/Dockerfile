# Stage 1: build React app
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Configure the API origin for login/logout links
ARG REACT_APP_SERVER_URL=http://localhost:5000
ENV REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL}

RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
