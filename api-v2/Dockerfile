FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install

# Copiamos el resto; en dev luego lo montamos como volumen
COPY . .

ENV HOST=0.0.0.0
EXPOSE 3000

# En compose sobreescribimos el CMD, pero dejamos uno por si se usa standalone
CMD ["npm", "run", "dev"]
