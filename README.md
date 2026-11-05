# Baba Spark

All-in-one AI workspace built with Next.js 15 (App Router), TypeScript and Tailwind CSS.

## Status
Phase 2: public marketing site only. Auth, database, AI tools, billing and admin are **not built yet**; login/register forms are disabled on purpose.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Change the brand name
Edit `src/config/brand.ts`. It updates the navbar, footer, logo and page titles.

## Deploy on Vercel
Push to GitHub, import the repo in Vercel, keep the defaults, and deploy.
