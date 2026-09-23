# Imagen base ligera con Node.js
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los manifiestos para aprovechar la caché de capas de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente y las pruebas
COPY . .

# Comando por defecto: ejecutar las pruebas de QA
CMD ["npm", "test"]
