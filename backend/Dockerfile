FROM node:18

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --only=production

RUN npm install -g pm2

COPY . .

EXPOSE 4000
EXPOSE 5000

CMD ["pm2-runtime", "server.js", "AuthServer.js"]