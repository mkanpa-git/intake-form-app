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
- **Environment variables**: copy `test-form/.env.example` to `test-form/.env` and `test-form/server/.env`, then update the following keys:

```
GOOGLE_API_KEY=<your Places API key>
SESSION_SECRET=<any random string>
DATABASE_URL=<postgres connection url>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
FILE_STORAGE=local # or 'gcp'
GCP_BUCKET=<gcs bucket name when using gcp>
CLAMAV_HOST=127.0.0.1
CLAMAV_PORT=3310
```

`GOOGLE_API_KEY` is required for the backend to make Google Places API requests. `SESSION_SECRET` secures Express sessions. `DATABASE_URL` points to your PostgreSQL database. The Google OAuth credentials are needed for authentication. Set `FILE_STORAGE` to `gcp` to store uploads in the bucket specified by `GCP_BUCKET`; otherwise files are kept on disk under `server/uploads`.

Uploads are scanned using [ClamAV](https://www.clamav.net/). Install and run `clamd` locally and adjust `CLAMAV_HOST` and `CLAMAV_PORT` if needed. Infected files are moved to `test-form/server/quarantine`.

The React app optionally reads `REACT_APP_SERVER_URL` to determine the Express server origin when building login and logout links. Copy `test-form/.env.example` to `test-form/.env` and edit it to override the default:

```bash
REACT_APP_SERVER_URL=http://localhost:5000
```

If not provided, the value defaults to `http://localhost:5000`.

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

## Help Chat

Form pages include a "Need Help?" button that opens a small chat window. Messages are sent to the `/api/help-chat` route which proxies requests to the OpenAI API. Set `OPENAI_API_KEY` in `test-form/server/.env` for the feature to work.

The chat endpoint now sends the current step's field info and any validation errors to the AI service. Replies include up to three suggested follow-up questions shown as clickable chips.

The Help Chat window uses the `jules_` design system. Messages now appear in modern
speech bubbles with clear distinction between user and assistant responses and
accessible colors.

Chat conversations are ephemeral and are **not** stored on the server. Responses may be inaccurate, so do not share personal or sensitive information.

## Docker build

A `Dockerfile` is provided under `test-form` to build the React client for production.

```bash
# Set the API origin when building so login links target the Express server
docker build \
  --build-arg REACT_APP_SERVER_URL=http://localhost:5000 \
  -t intake-form-client -f test-form/Dockerfile test-form
docker run -p 3000:80 intake-form-client
```

The container serves the compiled React app via nginx on host port `3000`. Adjust the `REACT_APP_SERVER_URL` build argument if the server runs elsewhere.
