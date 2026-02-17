# Multi-stage build for Next.js frontend with static export
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (this will create the 'out' directory due to output: 'export' in next.config.js)
RUN npm run build

# Verify build output exists
RUN ls -la /app/out

# Production stage with Nginx
FROM nginx:alpine

# Copy the exported static site
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx configuration for API proxying
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1