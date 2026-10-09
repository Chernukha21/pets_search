FROM node:22.19.0-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 5000
CMD ["npm", "start"]