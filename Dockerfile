ARG app_port

FROM node:alpine

RUN mkdir -p /app/server
WORKDIR /app/server
COPY . /app/server
RUN npm install
EXPOSE $app_port
CMD [ "npm", "start" ]