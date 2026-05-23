# Yool Frontend

Vite + React 18 frontend for Yool. It connects to the ASP.NET API and SignalR collaboration hub.

## Local Development

```powershell
npm install
npm run dev
```

For local backend proxying, leave `VITE_API_URL` empty and set:

```env
VITE_API_PROXY=http://localhost:5050
```

For production, set:

```env
VITE_API_URL=https://yool-api.onrender.com
```

## Scripts

```powershell
npm run dev
npm run build
npm run preview
```

## Deploy

Recommended: Vercel.

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variable:

```env
VITE_API_URL=https://yool-api.onrender.com
```

After Vercel gives you the frontend URL, add it to the backend Render service:

```env
CLIENT_URL=https://your-frontend-domain.vercel.app
```

Then redeploy the backend on Render.
