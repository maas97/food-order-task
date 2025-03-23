FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]