# To run the project
## Install dependencies
First need to make sure that Postgres is installed on your machine. Then run the following command to install the dependencies.

```bash
npm install
```

## Setup environment variables
Create a `.env` file in the root directory of the project and add the variables following the `env.example` file.
Then run the following command to start the project.

```bash
npm run dev
```
The server will start on port SERVER_PORT (3000 by default). You can access the Swagger UI at `http://localhost:SERVER_PORT/api-docs`

## For the first time setup

You need to migrate the database to the latest version. Run the following command to do so.

```bash
npm run migration:run
```

# Development

1. Migrate new changes to the database

```bash
npm run migration:generate -n migrations/<MigrationName>
```

2. Run the migration

```bash
npm run migration:run
```
