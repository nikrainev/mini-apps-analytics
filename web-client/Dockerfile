FROM node:22.10.0-alpine

RUN apk add --no-cache git
RUN rm -rf /var/cache/apk/*
RUN git --version

WORKDIR /app
COPY package.json /app
RUN npm install --force

COPY . /app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]