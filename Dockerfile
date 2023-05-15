FROM node:18-alpine

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

ENTRYPOINT npm run migrate && node dist/index.js

