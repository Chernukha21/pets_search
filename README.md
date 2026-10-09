# Animals Fullstack

An educational fullstack application for finding missing pets. Users can create listings, filter results, mark pets as found, and delete records.

## Features

- Create listings with pet details and owner contact information.
- Filter pets by type and status: found or missing.
- Retrieve pet lists and individual records through a REST API.
- Update the `isFound` status and delete listings.
- Validate input data and handle API errors.
- Run the client, server, and PostgreSQL with Docker Compose.
- Test CRUD operations against a separate test database.

## Tech Stack

| Component | Technologies |
| --- | --- |
| Frontend | React, Vite, Redux Toolkit, RTK Query, Formik, Yup, SCSS Modules |
| Backend | Node.js, Express, Sequelize, Yup, http-errors |
| Database | PostgreSQL |
| Testing | Mocha, Chai, Supertest, cross-env |
| Containerization | Docker, Docker Compose |

## Project Structure

| Path | Purpose |
| --- | --- |
| `client/` | React application |
| `server/app.js` | Express application, also imported by the tests |
| `server/index.js` | HTTP server entry point |
| `server/config/config.json` | PostgreSQL connection configuration |
| `server/models/` | Sequelize models |
| `server/controllers/` | CRUD controllers |
| `server/middleware/` | Validation and error handling |
| `server/routes/` | API routes |
| `server/migrations/` | Database table creation |
| `server/seeders/` | Initial and sample data |
| `server/tests/pets.test.js` | Pets API integration tests |

## Running with Docker

Docker Desktop and Docker Compose must be installed, and Docker Desktop must be running.

From the project root:

```bash
docker compose up --build -d
```

In the current Compose configuration, the server runs migrations before starting the application.

On the first run with a new, empty database, populate the pet type reference table and add sample listings:

```bash
docker compose exec server npx sequelize-cli db:seed:all
```

Run seeds once to populate a new database. Running them again may create duplicate records.

| Service | Address |
| --- | --- |
| Frontend | http://localhost:5001 |
| API | http://localhost:5000/api |
| PostgreSQL within the Compose network | `db:5432` |

The client and server source directories are connected through bind mounts for development. PostgreSQL data is stored in the `pg_data` named volume.

Check service status and view server logs:

```bash
docker compose ps
docker compose logs --tail=80 server
```

Stop the application and remove its containers while keeping the named data volume:

```bash
docker compose down
```

## Running Locally

Local development requires Node.js, npm, and a running PostgreSQL instance. The project Dockerfiles use Node.js 22.19.0.

Install dependencies from the project root:

```bash
npm --prefix client ci
npm --prefix server ci
```

Create `server/.env` from `server/.env.example`:

```bash
cp server/.env.example server/.env
```

The server port is configured through `PORT`; local development uses `5000`.

Sequelize reads its connection settings from `server/config/config.json`. Configure the `development` and `test` sections for your PostgreSQL instance:

```json
{
  "development": {
    "username": "postgres",
    "password": "admin",
    "database": "animals",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "admin",
    "database": "animals_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
}
```

The example uses local development credentials. Sequelize connects to PostgreSQL on port `5432` by default. To use a different port, add a `port` field to the relevant configuration section.

Prepare the development database from the `server` directory:

```bash
npx sequelize-cli db:create --env development
npx sequelize-cli db:migrate --env development
npx sequelize-cli db:seed:all --env development
```

Run `db:create` when creating the database for the first time. Run seeds when initially populating a new database.

Start the server from the `server` directory:

```bash
npm run dev
```

In another terminal, start the client from the `client` directory:

```bash
npm run dev
```

- Frontend: http://localhost:5173.
- API: http://localhost:5000/api.

## API

| Method | Path | Purpose | Success Status |
| --- | --- | --- | --- |
| GET | `/api/pet-types` | Retrieve pet types | 200 |
| GET | `/api/pets` | Retrieve the pet list | 200 |
| GET | `/api/pets/:id` | Retrieve a pet by ID | 200 |
| POST | `/api/pets` | Create a listing | 201 |
| PATCH | `/api/pets/:id` | Update `isFound` | 200 |
| DELETE | `/api/pets/:id` | Delete a listing | 204 |

Filters are passed as query parameters:

```text
GET /api/pets?petTypeIds=1,2&isFound=false
```

`petTypeIds` is a comma-separated list of positive integer IDs. `isFound` is the string `true` or `false`. Both filters are optional.

Example request body for creating a listing:

```json
{
  "name": "Murka",
  "owner": "Anna Kovalenko",
  "ownerContacts": "+380671112233",
  "description": "Grey cat with a red collar",
  "city": "Kyiv",
  "lostDate": "2020-01-01",
  "petTypeId": 1,
  "isFound": false
}
```

`petTypeId` must reference an existing record returned by `/api/pet-types`. Supported cities are `Kyiv`, `Dnipro`, and `New York`. The contact number must contain `+` followed by 12 digits.

Example request body for updating the status:

```json
{
  "isFound": true
}
```

The API returns `400` or `422` for invalid input and `404` when a pet does not exist. Successful deletion returns `204` with no response body.

## Testing

Tests run with `NODE_ENV=test` and use the separate `animals_test` database. For the commands below, PostgreSQL must be accessible at the address specified in the `test` section of `server/config/config.json`.

Before the first test run, prepare the test database from the `server` directory:

```bash
npx sequelize-cli db:create --env test
npx sequelize-cli db:migrate --env test
```

Run the tests from the `server` directory:

```bash
npm test
```

The test script uses `cross-env` to set `NODE_ENV=test` on Windows, Linux, and macOS.

`server/tests/pets.test.js` includes 15 integration tests:

- POST: valid creation, a missing name, and an invalid contact format.
- GET list: retrieving records, filtering by `isFound`, and an invalid filter value.
- GET by ID: an existing record, a missing record, and an invalid ID.
- PATCH: persisting a new status, an invalid `isFound` type, and a missing record.
- DELETE: deleting a record and verifying its removal from the database, a missing record, and an invalid ID.

The suite checks `NODE_ENV` and the database name before running. The pets table is cleared before each test, and each scenario creates its own required records. A shared `Cat` pet type is created if needed and used as reference data. The database connection is closed after the tests finish.

Sample seeds are not required for testing. Supertest imports `app.js`, so there is no need to start a separate HTTP server before running the tests.

## Tool Documentation

- [Sequelize migrations and seeds](https://sequelize.org/docs/v6/other-topics/migrations/).
- [Docker Compose commands](https://docs.docker.com/reference/cli/docker/compose/).

