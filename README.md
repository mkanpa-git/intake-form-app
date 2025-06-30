# Test Form Project

This repository contains a sample React and Express application located in the [`test-form`](test-form) directory. The React client and Express server are started together using a single command.

## Running the project

Install dependencies and start the development server:

```bash
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
