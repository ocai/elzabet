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

If changes are made to the Dockerfile(s), bring down the volume and rebuild
```
docker-compose down -v
docker-compose up --build
```

A shortcut to running commands on the application in Docker is present
You can use `./$ <command>` to run commands on the docker container.

i.e. `./$ ls` 


## Migrations and Knex
This application uses Knex for database migrations and seeding.

See https://knexjs.org/guide/migrations.html

Any seed/migrations can be run using the `./$` prefix to run in the docker container. (Docker container contains Knex).