# Silly Test Project

## Running Locally
### Requirements
- Nodejs
- npm
- mysql

```
npm install
npm start
```

## Running with Docker
`docker-compose up`
App waits for DB to be up, so it can take a little bit.

If changes are made to the Dockerfile(s)
```
docker-compose down -v
docker-compose up --build
```


## Migrations
https://knexjs.org/guide/migrations.html