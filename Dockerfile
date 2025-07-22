# Stage 1: Install dependencies
FROM node:alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development image
FROM node:alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["sh", "-c", "npm run dev -- --host"]
