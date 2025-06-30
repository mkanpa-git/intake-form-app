# Test Form Project

This repository contains a sample React and Express application located in the [`test-form`](test-form) directory. The React client and Express server are started together using a single command.

## Running the project

Ensure PostgreSQL is running locally on port **5432** and the database schema has been initialized. Then install dependencies and launch the app:

```bash
# start postgres locally and create the database
createdb intake_form
# enable pgcrypto for gen_random_uuid()
psql -d intake_form -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
psql -d intake_form -f test-form/server/db/schema.sql

# install dependencies and run the server/client together
npm install
npm run dev
```

The `dev` script runs both the Express API proxy and the React app so you can access the application at `http://localhost:3000`.

## Form Generation and Rendering

For details on how forms are dynamically generated and best practices for extending the form rendering capabilities, please refer to the [FORM_GENERATION_GUIDELINES.md](FORM_GENERATION_GUIDELINES.md) document.

The primary form configuration, `childcare_form.json`, is dynamically loaded at runtime by the `FormRenderer` component and should be located in `test-form/public/data/childcare_form.json`.

## Case management UI

The backend exposes a simple case management dashboard that lists submitted applications stored on the server. Start the server and visit `http://localhost:5000/cases` to review applications.

Selecting an application opens a page with each step's data shown in its own tab for easy review.

## Environment requirements

- **Node.js**: version 18 or later is recommended.
- **Environment variables**: create a `.env` file inside the `test-form/server` directory with the following keys:

```
GOOGLE_API_KEY=<your Places API key>
SESSION_SECRET=<any random string>
DATABASE_URL=<postgres connection url>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
```

`GOOGLE_API_KEY` is required for the backend to make Google Places API requests. `SESSION_SECRET` secures Express sessions. `DATABASE_URL` points to your PostgreSQL database. The Google OAuth credentials are needed for authentication.

## Database setup

Initialize Postgres and load the schema:

```bash
createdb intake_form
# enable pgcrypto for gen_random_uuid()
psql -d intake_form -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
psql -d intake_form -f test-form/server/db/schema.sql
# connect-pg-simple requires a session table
# you can also create it using:
# psql -d intake_form -f node_modules/connect-pg-simple/table.sql
```

Set `DATABASE_URL` in your `.env` file (defaults to `postgres://localhost:5432/intake_form`).

## Authentication

User authentication is handled through Google OAuth 2.0. Set the following keys in `test-form/server/.env`:

```bash
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
DATABASE_URL=<postgres connection url>
```

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must match your OAuth credentials on the Google Cloud console. `DATABASE_URL` should point to the PostgreSQL instance used by the server.

The `users` table stores OAuth provider information using `provider` and `provider_id` columns. The server queries these fields to locate or create the authenticated user.
