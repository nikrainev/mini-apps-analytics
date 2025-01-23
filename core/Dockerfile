FROM --platform=linux/amd64 node:22.10.0-alpine as builder

WORKDIR /app

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:22.10.0-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]