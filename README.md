# Silly Test Project

## Running Locally
### Requirements
- Nodejs
- npm
- mysql
- .env

Put the `.env` file at the project root directory - Get this from Me.

```
npm install
npm start
```

## Running with Docker
Make sure nothing is using PORTS 3000 and 3306.
For development, get `.env.dev` file from me and place it in the root of the project

`docker-compose up`
App waits for DB to be up, so it can take a little bit.

If changes are made to the Dockerfile(s), bring down the volume and rebuild
```
docker-compose down -v
docker-compose up --build
```

A MYSQL DB should be available on PORT 3306 with connection credentials:
```
User: root
Password: test
Database: elzabet
```

A shortcut to running commands on the application in Docker is present
You can use `./$ <command>` to run commands on the docker container.

i.e. `./$ ls` 

Note: Touse functionality that requires hitting the Riot API, replace the appropriate field in .env.dev with the RIOT API Key.

## Migrations and Knex
This application uses Knex for database migrations and seeding.

See https://knexjs.org/guide/migrations.html

Any seed/migrations can be run using the `./$` prefix to run in the docker container. (Docker container contains Knex).

Useful Commands:

Run migrations: `./$ knex migrate:latest`
Run seeds: `./$ knex seed:run`

## Running Tests
To run the full test suite, 
```
./$ npm test
```

## Deploying Slash Commands
To deploy any changes to slash commands,
```
./$ npm run deploy-commands
```
