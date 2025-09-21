# Build stage for frontend
FROM node:20-alpine as frontend-build
WORKDIR /app
COPY TodoApp\ Frontend/package*.json ./
RUN npm install
COPY TodoApp\ Frontend/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy backend files
COPY TodoApp\ Backend/package*.json ./
RUN npm install --production
COPY TodoApp\ Backend/ ./

# Copy frontend build
COPY --from=frontend-build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]