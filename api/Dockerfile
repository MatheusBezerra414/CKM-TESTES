# Base image
FROM node:20 as builder

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]