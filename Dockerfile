ARG app_port

FROM node:alpine

RUN mkdir -p /app/server
WORKDIR /app/server
COPY . /app/server
RUN npm install
RUN npm install -g knex
EXPOSE $app_port
CMD [ "npm", "start" ]