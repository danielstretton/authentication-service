FROM node:18.20.3-alpine3.20

RUN export auth_jwtPrivateKey=mySecureKey
ENV auth_jwtPrivateKey=mySecureKey

RUN npm install -g nodemon

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000

CMD ["nodemon", "ts-node", "src/index.ts"]