FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --only=production

COPY . .

EXPOSE 4000
EXPOSE 5000