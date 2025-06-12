# Test Form Project

This repository contains a sample React and Express application located in the [`test-form`](test-form) directory. The React client and Express server are started together using a single command.

## Running the project

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The `dev` script runs both the Express API proxy and the React app so you can access the application at `http://localhost:3000`.

## Case management UI

The backend exposes a simple case management dashboard that lists submitted applications stored on the server. Start the server and visit `http://localhost:5000/cases` to review applications.

Selecting an application opens a page with each step's data shown in its own tab for easy review.

## Environment requirements

- **Node.js**: version 18 or later is recommended.
- **Environment variables**: create a `.env` file inside the `test-form/server` directory with your Google Places API key:

```
GOOGLE_API_KEY=<your-key>
```

This key is required for the backend to make requests to the Google Places API.
