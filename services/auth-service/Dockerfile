# Usa Node.js 18 en una imagen liviana (Alpine Linux)
FROM node:18-alpine

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia TODO el código fuente al contenedor
COPY . .

# Expone el puerto donde corre el servicio (3001 para auth-service)
EXPOSE 3001

# Comando para iniciar el servicio
CMD ["npm", "start"]