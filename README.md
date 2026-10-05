# Vending Machine Frontend

React and TypeScript interface for customers and suppliers to use the vending
machine API.

## Prerequisites

- Node.js 24
- The backend API running on `http://localhost:8080`

## Run locally

Install the locked dependency versions and start Vite:

```powershell
npm ci
npm run dev
```

The app defaults to `http://localhost:8080/api`. To target another backend,
create an untracked `.env.local` file:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

Do not place secrets in `VITE_*` variables because Vite exposes them to the
browser.

## Verify changes

```powershell
npm run lint
npm run build
```
