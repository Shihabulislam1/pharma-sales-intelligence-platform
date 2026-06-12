FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the workspace
COPY . .

# Build the frontend application
# React Router's vite plugin keeps Node alive after build; timeout kills it, then we verify output
RUN timeout 60 npx vite build --config apps/frontend/vite.config.mts; \
    test -d apps/frontend/build/client && echo "Frontend build completed successfully"

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/apps/frontend/build/client /usr/share/nginx/html

# Copy a custom nginx configuration to handle React Router (SPA) and proxy /api
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
