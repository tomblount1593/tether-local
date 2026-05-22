# Tether Local

This app now runs locally from Codex without external login, external app APIs, or platform build tooling.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL, usually:

```bash
http://127.0.0.1:5173/
```

The current data layer is a browser-local store in `src/api/localClient.js`. It keeps the existing app screens working while we decide on the permanent backend.

## Deployments

The app is configured for Vercel production deploys and uses `vercel.json` to rewrite all routes to `index.html` so the Vite SPA works on direct page loads.

Current production URL:

```bash
https://tether-local.vercel.app
```

## GitHub And Vercel Workflow

Once this repository is connected to GitHub and the Vercel Git integration is enabled for the `main` branch:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Each push to `main` will trigger a fresh Vercel production deployment automatically.
