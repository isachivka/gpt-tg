FROM node:18-alpine

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY ./front/package.json ./front/
COPY ./front/package-lock.json ./front/
RUN cd ./front && npm install

COPY . .
RUN npm run build
RUN cd ./front && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]

