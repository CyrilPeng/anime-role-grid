# Deployment Guide - Cloudflare Pages

This project is a static Vue 3 application, which makes it perfect for free deployment on **Cloudflare Pages**.

## Prerequisites
1.  A GitHub account.
2.  A Cloudflare account (free).
3.  This project pushed to a GitHub repository.

## Steps

1.  **Log in to Cloudflare Dashboard**.
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select your GitHub repository (`anime-role-grid`).
4.  **Configure Build Settings**:
    *   **Framework preset**: `Vite` (or just leave as None, it usually auto-detects).
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
5.  **Environment Variables** (Optional but Recommended):
    *   If you want to use a specific Bangumi Token in production (though the current code uses the one in `.env` which is bundled at build time), you can set `VITE_BANGUMI_ACCESS_TOKEN` here.
    *   *Note*: Since this is a client-side app, the token in `.env` is baked into the code. If you want to change it without committing to Git, set it in Cloudflare.
6.  Click **Save and Deploy**.

## Verification
Cloudflare will build your project and provide a URL (e.g., `https://anime-role-grid.pages.dev`). Visit the link to verify everything works.

## Troubleshooting
- **CORS Issues**: If images don't load or export fails, it's usually because the external image server (Bangumi) blocks the request. However, Bangumi usually allows CORS.
- **Build Fails**: Check the build logs. Ensure `npm install` runs successfully.
