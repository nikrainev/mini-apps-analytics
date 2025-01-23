FROM node:18.13.0-alpine

WORKDIR /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

COPY ./package*.json ./

RUN npm ci --silent --also=dev

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["/bin/sh", "-c", "/wait && npm run start:prod"]
