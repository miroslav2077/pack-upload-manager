# Stage 1: builder
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --prod

FROM builder AS deployer
# Stage 2: deployer
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .
EXPOSE 3000
ENV NODE_ENV=production
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV ORIGIN=http://origin-behind-load-balancer.aws.com
CMD [ "node", "build" ]