# Technical Design

## Application Architecture

The project uses a React front‑end with an Express back‑end. The README notes that both are started together from the [`test-form`](test-form) directory using a single command."**" For development the `dev` script runs the Express API proxy and React app so the site is accessible at `http://localhost:3000`.【F:README.md†L1-L21】

Dynamic form definitions are loaded at runtime. The form renderer loads the specification using the `formSpecPath` prop, which defaults to `/data/childcare_form.json`.【F:test-form/src/components/core/FormRenderer/FormRenderer.jsx†L44-L72】

The Express server (`test-form/server/index.js`) handles Google OAuth authentication, session management and API endpoints for applications and file uploads. It also proxies calls to Google Places APIs for autocomplete and place details. 【F:test-form/server/index.js†L1-L177】【F:test-form/server/index.js†L187-L229】

## Data Architecture

PostgreSQL is used to persist users, applications and uploaded files. The schema is defined in `test-form/server/db/schema.sql` and creates three main tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(100) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  middle_initial TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_key TEXT NOT NULL,
  status TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  step_data JSONB NOT NULL DEFAULT '{}',
  all_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE application_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
【F:test-form/server/db/schema.sql†L1-L41】

Form specifications are stored in JSON under `childcare_form.json` and are loaded by the renderer at runtime using the `formSpecPath` prop.

## Technical Architecture

### Front‑End

- React application bootstrapped by Create React App (CRA) with custom theme stylesheets. `App.js` imports the `jules_` theme CSS files to style the interface. 【F:test-form/src/App.js†L10-L20】
- Form rendering is driven by `FormRenderer.jsx` which manages step state, validation and submission. It retrieves any saved draft from the server when loading. 【F:test-form/src/components/core/FormRenderer/FormRenderer.jsx†L29-L76】
- The application integrates with Google Places API through the Express server.

### Back‑End

- Express server handles authentication via Google OAuth 2.0, session storage in PostgreSQL and exposes REST endpoints for applications, uploads, and place lookups. 【F:test-form/server/index.js†L1-L152】【F:test-form/server/index.js†L268-L319】
- Multer stores uploaded files on disk under `server/uploads/<appId>/`. The server returns the stored paths. 【F:test-form/server/index.js†L120-L140】

### OpenAPI

An OpenAPI 3.0 specification is included under `openapi/openapi.yaml` providing a formal API definition for downstream integrations.

## Development Viewpoint

The README provides instructions for running the project. Developers need PostgreSQL, Node.js and several environment variables: `GOOGLE_API_KEY`, `SESSION_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. 【F:README.md†L35-L46】

Database setup scripts create the schema and enable `pgcrypto` for UUID generation. 【F:README.md†L60-L74】

The React app optionally reads `REACT_APP_SERVER_URL` from a `.env` file to know where the Express server is running. 【F:README.md†L50-L55】

Running `npm run dev` from the `test-form` directory starts both the server and client. 【F:README.md†L16-L21】

## Deployment Viewpoint

Deployments require Node.js and PostgreSQL. The Express server listens on `PORT` (default 5000) and uses environment variables to connect to the database and Google APIs. Build the client with `npm run build` and serve the static files via an appropriate web server (or from Express).

Sessions are stored in PostgreSQL via `connect-pg-simple` ensuring stateless server instances are supported. File uploads are kept on disk so deployments should provide persistent storage or use an alternative provider.

For authentication to work in production, the Google OAuth callback URL must match the deployed domain and the `.env` values must be configured appropriately.
## Integration Viewpoint

The React client communicates with the Express API in the `test-form/server` directory. The following endpoints are available for integrations.

### Authentication
- `GET /auth/google` &ndash; initiates Google OAuth sign in.
- `GET /auth/login` &ndash; redirects to `/auth/google`.
- `GET /auth/google/callback` &ndash; OAuth callback that redirects back to the client.
- `GET /auth/logout` &ndash; destroys the session and redirects to the client.

### User Profile
- `GET /api/me` &ndash; returns the authenticated user or `401` when not logged in. 【F:test-form/server/index.js†L95-L100】
- `PUT /api/me` &ndash; updates name fields for the current user. The request body accepts `first_name`, `middle_initial` and `last_name` and returns the updated record. 【F:test-form/server/index.js†L102-L118】

### Applications
- `POST /api/applications/:appId` &ndash; create or update an application. Responds with `{ "status": "ok" }`. 【F:test-form/server/index.js†L268-L277】
- `GET /api/applications` &ndash; list all stored applications. 【F:test-form/server/index.js†L279-L285】
- `GET /api/applications/:appId` &ndash; fetch a single application or `404` if it does not exist. 【F:test-form/server/index.js†L289-L297】
- `DELETE /api/applications/:appId` &ndash; delete an application. Responds with `{ "status": "ok" }`. 【F:test-form/server/index.js†L300-L307】
- `POST /api/applications/:appId/upload` &ndash; upload one or more files for an application using `multipart/form-data`. Returns the file paths. 【F:test-form/server/index.js†L133-L140】

### Google Places Proxy
- `GET /api/places/autocomplete?input=<text>&sessiontoken=<token>` &ndash; proxies to Google Places Autocomplete. 【F:test-form/server/index.js†L142-L197】
- `GET /api/places/details/:id?sessiontoken=<token>` &ndash; proxies to Google Places Details. 【F:test-form/server/index.js†L199-L231】

### Case Management UI
- `GET /cases` &ndash; lists applications in an HTML dashboard. 【F:test-form/server/index.js†L310-L314】
- `GET /cases/:appId` &ndash; shows a single application in the dashboard. 【F:test-form/server/index.js†L316-L319】

### External API Definition
An OpenAPI 3.0 specification (`openapi/openapi.yaml`) describes the external ModelCity Applications Service API. It defines a `GET /appl/{applId}` operation returning an `ApplicationSubmission` object. 【F:openapi/openapi.yaml†L60-L79】
