FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3000

# Usar npm run dev en lugar de nodemon directamente
CMD ["npm", "run", "dev"]

# CMD ["nodemon", "--legacy-watch", "app.js"]
