FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3002

CMD ["nodemon", "--legacy-watch", "src/index.js"]