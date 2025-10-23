FROM node:18.20-alpine3.19

WORKDIR /app

COPY server/package*.json ./

RUN npm ci

COPY server/ .

EXPOSE 3001

CMD ["npm", "start"]