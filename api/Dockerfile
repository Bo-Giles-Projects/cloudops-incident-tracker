FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY api/package.json api/package.json
COPY web/package.json web/package.json
RUN npm ci --omit=dev
COPY api/src api/src
EXPOSE 3001
CMD ["node", "api/src/server.js"]
