# React + Vite

## Backend setup

The API uses Sequelize with Neon PostgreSQL. Create a Neon project and copy its
connection string into `backend/.env` as `DATABASE_URL` (use the pooled
connection string for a serverless deployment). Neon requires SSL; the backend
configures it automatically. Start the API from the `backend` directory with
`npm install` and `npm run dev`. On startup, Sequelize creates any missing
tables for the models used by the API.

Copy the environment examples to local `.env` files; never commit actual
credentials. The frontend needs `VITE_GOOGLE_CLIENT_ID`; set `VITE_API_URL` to
the backend base URL in deployment (local development defaults to
`http://localhost:5055`). The backend requires `DATABASE_URL`, `JWT_SECRET`,
`GOOGLE_CLIENT_ID`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH`. The Google
client ID must match the frontend value. `FRONTEND_URL` must contain the exact
frontend origin in production; local Vite origins are already allowed.
`PORT` is optional when the hosting platform assigns it. Email settings are
only needed for the existing email features.

In Google Cloud, add `http://localhost:5175` (along with any other local dev ports such as `http://localhost:5173`) and your production frontend origin
as authorized JavaScript origins. The current frontend is
`https://coveillablog.vercel.app`; no OAuth redirect URI or Google Client
Secret is required for this ID-token flow. Configure the Vite variables in
Vercel and the backend variables on the API host. The backend API URL is not
specified here; set it as `VITE_API_URL` once known.

The API creates missing Sequelize model tables at startup with non-forcing
`sync()`. It does not drop tables or reset records. The live Neon `public`
schema was inspected read-only before implementation and contained no
application tables. Authentication tests use mocked models and do not connect
to or modify Neon.

Run backend tests with `cd backend && npm test`. Run frontend checks from the
project root with `npm run build` and `npm run lint`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
